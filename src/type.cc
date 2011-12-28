#include "type.h"
#include "nstring.h"

using namespace v8;
using namespace node;
using namespace nclang;

#define KIND String::NewSymbol("kind")
#define SPELL String::NewSymbol("spelling")
#define RESULT String::NewSymbol("result")

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

  target->Set(String::NewSymbol("type"), Klass->GetFunction());
}
