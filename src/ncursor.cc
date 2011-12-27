#include <cstdlib>
#include "ncursor.h"
#include "nstring.h"

using namespace v8;
using namespace node;
using namespace nclang;

#define USR String::NewSymbol("usr")

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

  Local<Value> ret = vd->cb->Call(s->handle_, 1, argv);

  return (CXChildVisitResult) ret->Uint32Value();
}

Handle<Value>
NCursor::Visit(const Arguments &args)
{
  HandleScope scope;
  NCursor *c = ObjectWrap::Unwrap<NCursor>(args.This());
  Local<Function> callback = Local<Function>::Cast(args[0]);
  struct VisitorData *data = (VisitorData *)malloc(sizeof(struct VisitorData));
  data->cb = Persistent<Function>::New(callback);
  clang_visitChildren(c->opaque_, Visitor, data);
  return args.This();
}

static Handle<Value>
StringGetter(Local<String> property, const AccessorInfo& info)
{
  HandleScope scope;
  NCursor *c = ObjectWrap::Unwrap<NCursor>(info.This());
  CXString s;

  if (USR == property)
    s = clang_getCursorUSR(c->opaque_);
  
  return scope.Close(from_string(s));
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
  Klass->PrototypeTemplate()->SetAccessor(USR, StringGetter);
  target->Set(String::NewSymbol("cursor"), Klass->GetFunction());
}
