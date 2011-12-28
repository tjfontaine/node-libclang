#ifndef NCLANG_CONSTANTS_H
#define NCLANG_CONSTANTS_H

#include <node.h>
#include <clang-c/Index.h>

static v8::Persistent<v8::Object> KINDS;
static v8::Persistent<v8::Object> TYPES;
void ConstantsInitialize(v8::Handle<v8::Object> target);

#endif
