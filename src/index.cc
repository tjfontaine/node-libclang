#include "index.h"

using namespace v8;
using namespace node;
using namespace nclang;

Handle<Value>
Index::New(const Arguments &args)
{
  HandleScope scope;
  Index *i = new Index();
  i->opaque_ = clang_createIndex(0, 0);
  i->Wrap(args.This());
  return args.This();
}

Handle<Value>
Index::Dispose(const Arguments &args)
{
  HandleScope scope;
  Index *i = ObjectWrap::Unwrap<Index>(args.This());
  clang_disposeIndex(i->opaque_);
  i->opaque_ = NULL;
  return args.This();
}

void
Index::Initialize(Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  t->InstanceTemplate()->SetInternalFieldCount(1);
  NODE_SET_PROTOTYPE_METHOD(t, "dispose", Dispose);
  target->Set(String::NewSymbol("index"), t->GetFunction());
}
