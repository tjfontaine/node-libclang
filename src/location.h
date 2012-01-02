#ifndef NCLANG_LOCATION_H
#define NCLANG_LOCATION_H

#include <node.h>
#include <clang-c/Index.h>

namespace nclang
{
  class Location : public node::ObjectWrap
  {
  public:
    CXSourceLocation opaque_;
    static void Initialize(v8::Handle<v8::Object> target);
    static v8::Handle<v8::Value> New(const v8::Arguments &args);
    static Location* New(CXSourceLocation cx);
    static v8::Persistent<v8::FunctionTemplate> Klass;
  };
}

#endif
