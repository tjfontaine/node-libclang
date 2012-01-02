#include "location.h"
#include "nstring.h"

using namespace v8;
using namespace node;
using namespace nclang;

#define PLOC String::NewSymbol("presumedLocation")

Location*
Location::New(CXSourceLocation csl)
{
  Local<Object> self = Klass->GetFunction()->NewInstance();
  Location *l = ObjectWrap::Unwrap<Location>(self);
  l->opaque_ = csl;
  return l;
}

Handle<Value>
Location::New(const Arguments &args)
{
  HandleScope scope;
  Location *l = new Location();
  l->opaque_ = clang_getNullLocation();
  l->Wrap(args.This());
  return args.This();
}

static Handle<Value>
Getter(Local<String> property, const AccessorInfo& info)
{
  HandleScope scope;
  Location *l = ObjectWrap::Unwrap<Location>(info.This());

  if (PLOC == property)
  {
    CXString f;
    unsigned line;
    unsigned column;
    clang_getPresumedLocation(l->opaque_, &f, &line, &column);
    Local<Object> ret = Object::New();
    ret->Set(String::New("filename"), from_string(f));
    ret->Set(String::New("line"), Integer::New(line));
    ret->Set(String::New("column"), Integer::New(column));
    return scope.Close(ret);
  }

  return Undefined();
}

Persistent<FunctionTemplate> Location::Klass;

void
Location::Initialize(Handle<Object> target)
{
  HandleScope scope;
  Local<FunctionTemplate> t = FunctionTemplate::New(New);
  Klass = Persistent<FunctionTemplate>::New(t);

  Klass->InstanceTemplate()->SetInternalFieldCount(1);

  Klass->PrototypeTemplate()->SetAccessor(PLOC, Getter);

  target->Set(String::NewSymbol("sourcelocation"), Klass->GetFunction());
}
