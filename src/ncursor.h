#ifndef NCLANG_INDEX_H
#define NCLANG_INDEX_H

#include <node.h>
#include <clang-c/Index.h>

namespace nclang
{
  class NCursor : public node::ObjectWrap
  {
  public:
    CXCursor opaque_;
    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Handle<v8::Value> New(const v8::Arguments &args);
    static v8::Handle<v8::Value> Visit(const v8::Arguments &args);
  };
}

#endif
