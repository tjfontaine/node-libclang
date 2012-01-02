#include "index.h"
#include "translation.h"
#include "ncursor.h"
#include "constants.h"
#include "type.h"
#include "location.h"

using namespace v8;
using namespace node;
using namespace nclang;

extern "C" void
init (Handle<Object> target)
{
  HandleScope scope;
  ConstantsInitialize(target);
  Index::Initialize(target);
  TranslationUnit::Initialize(target);
  NCursor::Initialize(target);
  Type::Initialize(target);
  Location::Initialize(target);
}

NODE_MODULE(libclang, init)
