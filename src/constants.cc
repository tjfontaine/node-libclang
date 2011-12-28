#include "constants.h"

using namespace v8;
using namespace node;

void
ConstantsInitialize(v8::Handle<v8::Object> target)
{
  NODE_DEFINE_CONSTANT(target, CXChildVisit_Break);
  NODE_DEFINE_CONSTANT(target, CXChildVisit_Continue);
  NODE_DEFINE_CONSTANT(target, CXChildVisit_Recurse);

  KINDS = v8::Persistent<v8::Object>(v8::Object::New());

  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnexposedDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_StructDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnionDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ClassDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_EnumDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FieldDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_EnumConstantDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FunctionDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_VarDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ParmDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCInterfaceDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCCategoryDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCProtocolDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCPropertyDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCIvarDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCInstanceMethodDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCClassMethodDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCImplementationDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCCategoryImplDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TypedefDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXMethod);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_Namespace);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_LinkageSpec);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_Constructor);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_Destructor);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ConversionFunction);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TemplateTypeParameter);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_NonTypeTemplateParameter);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TemplateTemplateParameter);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FunctionTemplate);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ClassTemplate);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ClassTemplatePartialSpecialization);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_NamespaceAlias);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UsingDirective);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UsingDeclaration);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TypeAliasDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCSynthesizeDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCDynamicDecl);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXAccessSpecifier);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FirstRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCSuperClassRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCProtocolRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCClassRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TypeRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXBaseSpecifier);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TemplateRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_NamespaceRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_MemberRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_LabelRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_OverloadedDeclRef);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FirstInvalid);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_InvalidFile);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_NoDeclFound);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_NotImplemented);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_InvalidCode);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FirstExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnexposedExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_DeclRefExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_MemberRefExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CallExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCMessageExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_BlockExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_IntegerLiteral);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FloatingLiteral);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ImaginaryLiteral);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_StringLiteral);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CharacterLiteral);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ParenExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnaryOperator);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ArraySubscriptExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_BinaryOperator);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CompoundAssignOperator);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ConditionalOperator);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CStyleCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CompoundLiteralExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_InitListExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_AddrLabelExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_StmtExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_GenericSelectionExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_GNUNullExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXStaticCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXDynamicCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXReinterpretCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXConstCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXFunctionalCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXTypeidExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXBoolLiteralExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXNullPtrLiteralExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXThisExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXThrowExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXNewExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXDeleteExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnaryExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCStringLiteral);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCEncodeExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCSelectorExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCProtocolExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCBridgedCastExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_PackExpansionExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_SizeOfPackExpr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FirstStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnexposedStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_LabelStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CompoundStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CaseStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_DefaultStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_IfStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_SwitchStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_WhileStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_DoStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ForStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_GotoStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_IndirectGotoStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ContinueStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_BreakStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ReturnStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_AsmStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCAtTryStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCAtCatchStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCAtFinallyStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCAtThrowStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCAtSynchronizedStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCAutoreleasePoolStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_ObjCForCollectionStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXCatchStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXTryStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXForRangeStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_SEHTryStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_SEHExceptStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_SEHFinallyStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_NullStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_DeclStmt);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_TranslationUnit);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_FirstAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_UnexposedAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_IBActionAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_IBOutletAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_IBOutletCollectionAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXFinalAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_CXXOverrideAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_AnnotateAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_AsmLabelAttr);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_PreprocessingDirective);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_MacroDefinition);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_MacroExpansion);
  NODE_DEFINE_CONSTANT(KINDS, CXCursor_InclusionDirective);

  v8::Local<v8::Array> props = KINDS->GetPropertyNames();

  size_t i;

  for (i = 0; i < props->Length(); i++)
  {
    v8::Local<v8::Value> key = props->Get(v8::Integer::New(i));
    v8::Local<v8::Value> value = KINDS->Get(key);
    KINDS->Set(value, key);
  }

/* DUPLICATES
  CXCursor_FirstDecl                     = CXCursor_UnexposedDecl,
  CXCursor_LastDecl                      = CXCursor_CXXAccessSpecifier,
  CXCursor_LastRef                       = CXCursor_OverloadedDeclRef,
  CXCursor_LastInvalid                   = CXCursor_InvalidCode,
  CXCursor_LastExpr                      = CXCursor_SizeOfPackExpr,
  CXCursor_LastStmt                      = CXCursor_DeclStmt,
  CXCursor_LastAttr                      = CXCursor_AsmLabelAttr,
  CXCursor_MacroInstantiation            = CXCursor_MacroExpansion,
  CXCursor_FirstPreprocessing            = CXCursor_PreprocessingDirective,
  CXCursor_LastPreprocessing             = CXCursor_InclusionDirective
 */

  target->Set(v8::String::NewSymbol("KINDS"), KINDS);

  TYPES = v8::Persistent<v8::Object>(v8::Object::New());

  NODE_DEFINE_CONSTANT(TYPES, CXType_Invalid);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Unexposed);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Void);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Bool);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Char_U);
  NODE_DEFINE_CONSTANT(TYPES, CXType_UChar);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Char16);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Char32);
  NODE_DEFINE_CONSTANT(TYPES, CXType_UShort);
  NODE_DEFINE_CONSTANT(TYPES, CXType_UInt);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ULong);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ULongLong);
  NODE_DEFINE_CONSTANT(TYPES, CXType_UInt128);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Char_S);
  NODE_DEFINE_CONSTANT(TYPES, CXType_SChar);
  NODE_DEFINE_CONSTANT(TYPES, CXType_WChar);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Short);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Int);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Long);
  NODE_DEFINE_CONSTANT(TYPES, CXType_LongLong);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Int128);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Float);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Double);
  NODE_DEFINE_CONSTANT(TYPES, CXType_LongDouble);
  NODE_DEFINE_CONSTANT(TYPES, CXType_NullPtr);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Overload);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Dependent);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ObjCId);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ObjCClass);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ObjCSel);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Complex);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Pointer);
  NODE_DEFINE_CONSTANT(TYPES, CXType_BlockPointer);
  NODE_DEFINE_CONSTANT(TYPES, CXType_LValueReference);
  NODE_DEFINE_CONSTANT(TYPES, CXType_RValueReference);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Record);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Enum);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Typedef);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ObjCInterface);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ObjCObjectPointer);
  NODE_DEFINE_CONSTANT(TYPES, CXType_FunctionNoProto);
  NODE_DEFINE_CONSTANT(TYPES, CXType_FunctionProto);
  NODE_DEFINE_CONSTANT(TYPES, CXType_ConstantArray);
  NODE_DEFINE_CONSTANT(TYPES, CXType_Vector);

  props = TYPES->GetPropertyNames();
  for (i = 0; i < props->Length(); i++)
  {
    v8::Local<v8::Value> key = props->Get(v8::Integer::New(i));
    v8::Local<v8::Value> value = KINDS->Get(key);
    TYPES->Set(value, key);
  }

  NODE_DEFINE_CONSTANT(TYPES, CXType_FirstBuiltin);
  NODE_DEFINE_CONSTANT(TYPES, CXType_LastBuiltin);

  target->Set(v8::String::NewSymbol("TYPES"), TYPES);
}
