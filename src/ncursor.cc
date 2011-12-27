#include "ncursor.h"

using namespace v8;
using namespace node;
using namespace nclang;

Handle<Value>
NCursor::New(const Arguments &args)
{
  HandleScope scope;
  NCursor *c = new NCursor();
  c->Wrap(args.This());
  return args.This();
}

Handle<Value>
NCursor::Visit(const Arguments &args)
{
  HandleScope scope;
  return args.This();
}

void
NCursor::Initialize(Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  t->InstanceTemplate()->SetInternalFieldCount(1);
  NODE_SET_PROTOTYPE_METHOD(t, "visitChildren", Visit);
  target->Set(String::NewSymbol("cursor"), t->GetFunction());
}
