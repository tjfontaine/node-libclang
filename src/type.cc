#include "type.h"
#include "nstring.h"
#include "ncursor.h"

using namespace v8;
using namespace node;
using namespace nclang;

#define KIND String::NewSymbol("kind")
#define SPELL String::NewSymbol("spelling")
#define RESULT String::NewSymbol("result")
#define CANON String::NewSymbol("canonical")
#define ARGC String::NewSymbol("argTypes")
#define DECL String::NewSymbol("declaration")
#define PTR String::NewSymbol("pointeeType")

Type*
Type::New(CXType ct)
{
  Local<Object> self = Klass->GetFunction()->NewInstance();
  Type *t = ObjectWrap::Unwrap<Type>(self);
  t->opaque_ = ct;
  return t;
}

Handle<Value>
Type::New(const Arguments &args)
{
  HandleScope scope;
  Type *t = new Type();
  t->Wrap(args.This());
  return args.This();
}

Handle<Value>
Type::GetArg(const Arguments &args)
{
  HandleScope scope;
  Type *t = ObjectWrap::Unwrap<Type>(args.This());
  Type *nt = Type::New(clang_getArgType(t->opaque_, args[0]->Uint32Value()));
  return scope.Close(nt->handle_);
}

Handle<Value>
Type::IsPOD(const Arguments &args)
{
  HandleScope scope;
  Type *t = ObjectWrap::Unwrap<Type>(args.This());
  return scope.Close(Boolean::New(clang_isPODType(t->opaque_)));
}

static Handle<Value>
Getter(Local<String> property, const AccessorInfo& info)
{
  HandleScope scope;
  Type *t = ObjectWrap::Unwrap<Type>(info.This());

  if (KIND == property)
    return scope.Close(Integer::New(t->opaque_.kind));
  else if (SPELL == property)
    return scope.Close(from_string(clang_getTypeKindSpelling(t->opaque_.kind)));
  else if (RESULT == property)
  {
    Type *nt = Type::New(clang_getResultType(t->opaque_));
    return scope.Close(nt->handle_);
  }
  else if (CANON == property)
  {
    Type *nt = Type::New(clang_getCanonicalType(t->opaque_));
    return scope.Close(nt->handle_);
  }
  else if (ARGC == property)
  {
    size_t count = clang_getNumArgTypes(t->opaque_);
    Local<Value> nc = Integer::New(count);
    return scope.Close(nc);
  }
  else if (DECL == property)
  {
    NCursor *c = NCursor::New(clang_getTypeDeclaration(t->opaque_));
    return scope.Close(c->handle_);
  }
  else if (PTR == property)
  {
    Type *nt = Type::New(clang_getPointeeType(t->opaque_));
    return scope.Close(nt->handle_);
  }

  return Undefined();
}
Persistent<FunctionTemplate> Type::Klass;

void
Type::Initialize(Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Klass = Persistent<FunctionTemplate>::New(t);

  Klass->InstanceTemplate()->SetInternalFieldCount(1);

  Klass->PrototypeTemplate()->SetAccessor(KIND, Getter);
  Klass->PrototypeTemplate()->SetAccessor(SPELL, Getter);
  Klass->PrototypeTemplate()->SetAccessor(RESULT, Getter);
  Klass->PrototypeTemplate()->SetAccessor(CANON, Getter);
  Klass->PrototypeTemplate()->SetAccessor(ARGC, Getter);
  Klass->PrototypeTemplate()->SetAccessor(DECL, Getter);
  Klass->PrototypeTemplate()->SetAccessor(PTR, Getter);

  NODE_SET_PROTOTYPE_METHOD(t, "getArg", GetArg);
  NODE_SET_PROTOTYPE_METHOD(t, "isPOD", IsPOD);

  target->Set(String::NewSymbol("type"), Klass->GetFunction());
}
