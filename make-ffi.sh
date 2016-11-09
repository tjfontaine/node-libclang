#!/bin/bash
#
INC_DIR=$(llvm-config --includedir)

echo "*************************************************************************"
echo "*** Make sure you fix 'CXClientData' and 'CXCursorVisitor' in the"
echo "*** generated 'lib/clang-c.js' or any use of"
echo "*** 'TranslationUnit.cursor.visitChildren( ... )' will fail."
echo "***"
echo "var CXClientData = exports.CXClientData = ref.types.Object; // was voidPtr"
echo "var CXCursorVisitor = exports.CXCursorVisitor = FFI.Function(ref.types.uint32, ["
echo "  CXCursor,"
echo "  CXCursor,"
echo "  CXClientData, // was voidptr"
echo "]);"
echo "*************************************************************************"
echo

ffi-generate \
  --file ${INC_DIR}/clang-c/Index.h \
  --prefix 'clang_' \
  --includes ${INC_DIR} \
  --library libclang \
    > lib/clang-c.js
