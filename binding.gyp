{
  'targets': [ {
    'variables': {
      'llvm-config': 'llvm-config',
    },
    'target_name': 'bindings',
    'sources': [
      'src/libclang.cc',
      'src/index.cc',
      'src/translation.cc',
      'src/ncursor.cc',
      'src/constants.cc',
      'src/type.cc',
      'src/location.cc'
    ],
    'include_dirs+': [
      '<!@(<(llvm-config) --includedir)'
    ],
    'libraries': [
      '-lclang',
    ],
    'ldflags': [
      '-L<!@(<(llvm-config) --libdir)'
    ]
  } ]
}
