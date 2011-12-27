#ifndef NCLANG_TRANSLATION_H
#define NCLANG_TRANSLATION_H

#include <node.h>
#include <clang-c/Index.h>

namespace nclang
{
  class TranslationUnit : public node::ObjectWrap
  {
  public:
    CXTranslationUnit opaque_;
    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Handle<v8::Value> New(const v8::Arguments &args);
    static v8::Handle<v8::Value> getCursor(const v8::Arguments &args);
    static v8::Handle<v8::Value> Dispose(const v8::Arguments &args);
    static v8::Handle<v8::Value> Source(const v8::Arguments &args);
  };
}
#endif
