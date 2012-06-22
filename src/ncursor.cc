#include <cstdlib>
#include "ncursor.h"
#include "nstring.h"
#include "constants.h"
#include "type.h"
#include "location.h"

using namespace v8;
using namespace node;
using namespace nclang;

#define USR String::NewSymbol("usr")
#define KIND String::NewSymbol("kind")
#define SPELL String::NewSymbol("spelling")
#define DISPLAY String::NewSymbol("displayname")
#define TYPE String::NewSymbol("type")
#define ENUMTYPE String::NewSymbol("enumType")
#define LOC String::NewSymbol("location")
#define ENUMVALUE String::NewSymbol("enumValue")
#define ENUMUVALUE String::NewSymbol("enumUValue")

NCursor*
NCursor::New(CXCursor cx)
{
  Local<Object> self = Klass->GetFunction()->NewInstance();
  NCursor *c = ObjectWrap::Unwrap<NCursor>(self);
  c->opaque_ = cx;
  return c;
}

Handle<Value>
NCursor::New(const Arguments &args)
{
  HandleScope scope;
  NCursor *c = new NCursor();
  c->opaque_ = clang_getNullCursor();
  c->Wrap(args.This());
  return args.This();
}

struct VisitorData
{
  Persistent<Function> cb;
  Persistent<Value> err;
};

static CXChildVisitResult
Visitor(CXCursor self, CXCursor parent, CXClientData data)
{
  HandleScope scope;

  NCursor *s = NCursor::New(self);
  NCursor *p = NCursor::New(parent);

  struct VisitorData *vd = (struct VisitorData *)data;

  Handle<Value> argv[1];
  argv[0] = p->handle_;

  TryCatch ce;
  Local<Value> ret = vd->cb->Call(s->handle_, 1, argv);

  if (!ce.HasCaught())
    return (CXChildVisitResult) ret->Uint32Value();
  else
  {
    vd->err.Dispose();
    vd->err = Persistent<Value>::New(ce.Exception());
    return CXChildVisit_Break;
  }
}

Handle<Value>
NCursor::Visit(const Arguments &args)
{
  HandleScope scope;
  NCursor *c = ObjectWrap::Unwrap<NCursor>(args.This());
  Local<Function> callback = Local<Function>::Cast(args[0]);

  struct VisitorData *data = (VisitorData *)malloc(sizeof(struct VisitorData));
  data->cb = Persistent<Function>::New(callback);
  data->err = Persistent<Value>::New(Undefined());

  clang_visitChildren(c->opaque_, Visitor, data);

  data->cb.Dispose();

  if (!data->err->IsUndefined())
  {
    Local<Value> err = Local<Value>::New(data->err);
    data->err.Dispose();
    return ThrowException(err);
  }
  else
  {
    data->err.Dispose();
    return args.This();
  }
}

static Handle<Value>
Getter(Local<String> property, const AccessorInfo& info)
{
  HandleScope scope;
  NCursor *c = ObjectWrap::Unwrap<NCursor>(info.This());

  if (USR == property)
    return scope.Close(from_string(clang_getCursorUSR(c->opaque_)));
  else if (SPELL == property)
    return scope.Close(from_string(clang_getCursorSpelling(c->opaque_)));
  else if (DISPLAY == property)
    return scope.Close(from_string(clang_getCursorDisplayName(c->opaque_)));
  else if (KIND == property)
  {
    CXCursorKind k = clang_getCursorKind(c->opaque_);
    Local<Value> ki = Integer::New(k);
    return scope.Close(ki);
  }
  else if (TYPE == property)
  {
    Type *t = Type::New(clang_getCursorType(c->opaque_));
    return scope.Close(t->handle_);
  }
  else if (ENUMTYPE == property)
  {
    Type *t = Type::New(clang_getEnumDeclIntegerType(c->opaque_));
    return scope.Close(t->handle_);
  }
  else if (LOC == property)
  {
    Location *l = Location::New(clang_getCursorLocation(c->opaque_));
    return scope.Close(l->handle_);
  }
  else if (ENUMVALUE == property)
  {
    return Number::New(clang_getEnumConstantDeclValue(c->opaque_));
  }
  else if (ENUMUVALUE == property)
  {
    return Number::New(clang_getEnumConstantDeclUnsignedValue(c->opaque_));
  }
  
  return Undefined();
}

Persistent<FunctionTemplate> NCursor::Klass;

void
NCursor::Initialize(Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Klass = Persistent<FunctionTemplate>::New(t);

  Klass->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(Klass, "visitChildren", Visit);

  Klass->PrototypeTemplate()->SetAccessor(USR, Getter);
  Klass->PrototypeTemplate()->SetAccessor(SPELL, Getter);
  Klass->PrototypeTemplate()->SetAccessor(DISPLAY, Getter);
  Klass->PrototypeTemplate()->SetAccessor(KIND, Getter);
  Klass->PrototypeTemplate()->SetAccessor(TYPE, Getter);
  Klass->PrototypeTemplate()->SetAccessor(ENUMTYPE, Getter);
  Klass->PrototypeTemplate()->SetAccessor(LOC, Getter);
  Klass->PrototypeTemplate()->SetAccessor(ENUMVALUE, Getter);
  Klass->PrototypeTemplate()->SetAccessor(ENUMUVALUE, Getter);

  target->Set(String::NewSymbol("cursor"), Klass->GetFunction());
}
