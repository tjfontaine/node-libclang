#ifndef NCLANG_TYPE_H
#define NCLANG_TYPE_H

#include <node.h>
#include <clang-c/Index.h>

namespace nclang
{
  class Type : public node::ObjectWrap
  {
  public:
    CXType opaque_;
    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Handle<v8::Value> New(const v8::Arguments &args);
    static Type* New(CXType ct);
    static v8::Persistent<v8::FunctionTemplate> Klass;
  };
}

#endif
