#ifndef NCLANG_CONSTANTS_H
#define NCLANG_CONSTANTS_H

#include <node.h>
#include <clang-c/Index.h>

void
ConstantsInitialize(v8::Handle<v8::Object> target)
{
  NODE_DEFINE_CONSTANT(target, CXChildVisit_Break);
  NODE_DEFINE_CONSTANT(target, CXChildVisit_Continue);
  NODE_DEFINE_CONSTANT(target, CXChildVisit_Recurse);

  //NODE_DEFINE_CONSTANT(target,);
}
#endif
