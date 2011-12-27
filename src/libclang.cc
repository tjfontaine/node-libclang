#include "index.h"
#include "translation.h"
#include "ncursor.h"

using namespace v8;
using namespace node;
using namespace nclang;

extern "C" void
init (Handle<Object> target)
{
  HandleScope scope;
  Index::Initialize(target);
  TranslationUnit::Initialize(target);
  NCursor::Initialize(target);
}

NODE_MODULE(libclang, init)
