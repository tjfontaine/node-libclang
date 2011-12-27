#ifndef NCLANG_INDEX_H
#define NCLANG_INDEX_H

#include <node.h>
#include <clang-c/Index.h>

namespace nclang
{
  class Index : public node::ObjectWrap
  {
  public:
    CXIndex opaque_;
    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Handle<v8::Value> New(const v8::Arguments &args);
    static v8::Handle<v8::Value> Dispose(const v8::Arguments &args);
  };
}

#endif
