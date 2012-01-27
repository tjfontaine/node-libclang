{
  'targets': [
    {
      'target_name': 'libclang',
      'sources': [
        'src/libclang.cc',
        'src/index.cc',
        'src/translation.cc',
        'src/ncursor.cc',
        'src/constants.cc',
        'src/type.cc',
        'src/location.cc'
      ],
      'include_dirs': [
          'deps/clang/include'
      ],
      'conditions': [
        ['OS=="win"', {
          'libraries': [
             'deps/clang/lib/libclang.lib'
          ]
        }]
      ]
    }
  ]
}