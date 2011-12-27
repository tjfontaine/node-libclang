#include "translation.h"
#include "index.h"
#include "ncursor.h"

using namespace v8;
using namespace node;
using namespace nclang;

Handle<Value>
TranslationUnit::New(const Arguments &args)
{
  HandleScope scope;
  TranslationUnit *tu = new TranslationUnit();
  tu->Wrap(args.This());
  return args.This();
}

Handle<Value>
TranslationUnit::getCursor(const Arguments &args)
{
  HandleScope scope;
  TranslationUnit *tu = ObjectWrap::Unwrap<TranslationUnit>(args.This());

  NCursor *curs = new NCursor();
  curs->opaque_ = clang_getTranslationUnitCursor(tu->opaque_);
  Local<Object> obj;
  curs->Wrap(obj);

  return scope.Close(obj);
}

Handle<Value>
TranslationUnit::Dispose(const Arguments &args)
{
  HandleScope scope;
  return args.This();
}

Handle<Value>
TranslationUnit::Source(const Arguments &args)
{
  HandleScope scope;

  TranslationUnit *tu = ObjectWrap::Unwrap<TranslationUnit>(args.This());
  Index *i = ObjectWrap::Unwrap<Index>(args[0]->ToObject());
  String::Utf8Value s(args[1]->ToString());

  char *argv[] = { "-Xclang" };
  tu->opaque_ = clang_createTranslationUnitFromSourceFile(i->opaque_, *s, 1, argv, 0, 0);

  return args.This();
}

void
TranslationUnit::Initialize(Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  t->InstanceTemplate()->SetInternalFieldCount(1);
  NODE_SET_PROTOTYPE_METHOD(t, "cursor", getCursor);
  NODE_SET_PROTOTYPE_METHOD(t, "dispose", Dispose);
  NODE_SET_PROTOTYPE_METHOD(t, "fromSource", Source);
  target->Set(String::NewSymbol("translationunit"), t->GetFunction());
}
