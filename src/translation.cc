#include <string.h>
#include <stdlib.h>

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

  NCursor *n = NCursor::New(clang_getTranslationUnitCursor(tu->opaque_));

  return scope.Close(n->handle_);
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

  size_t argc;
  char **argv;

  if (args.Length() > 2 && args[2]->IsArray())
  {
    Local<Array> a = Local<Array>::Cast(args[2]);
    size_t i;

    argc = a->Length();
    argv = new char*[argc + 1 + 1];
    for (i = 0; i < argc; i++) {
      String::Utf8Value b(a->Get(Integer::New(i))->ToString());
      argv[i] = strdup(*b);
    }
  }
  else
  {
    argc = 0;
    argv = NULL;
  }

  tu->opaque_ = clang_createTranslationUnitFromSourceFile(i->opaque_, *s, argc, argv, 0, 0);

  if (argc > 0)
  {
    size_t i;
    for (i = 0; i < argc; i++)
    {
      free(argv[i]);
    }
    delete argv;
  }

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
