#ifndef NCLANG_STRING_H
#define NCLANG_STRING_H
#include <node.h>
#include <clang-c/Index.h>

inline const v8::Handle<v8::Value>
from_string(CXString cx)
{
  v8::HandleScope scope;
  v8::Local<v8::Value> s = v8::String::New(clang_getCString(cx));
  clang_disposeString(cx);
  return scope.Close(s);
}

#endif
