import Options
from os import unlink, symlink, popen
from os.path import exists 

VERSION = "0.0.3"

def set_options(opt):
  opt.tool_options("compiler_cxx")
  opt.tool_options("compiler_cc")

def configure(conf):
  conf.check_tool("compiler_cxx")
  conf.check_tool("compiler_cc")
  conf.check_tool("node_addon")

  llvm_config = conf.find_program('llvm-config', var='LLVM_CONFIG', mandatory=True)
  llvm_libdir = popen("%s --libdir" % llvm_config).readline().strip()
  conf.env.append_value("LIBPATH_LLVM", llvm_libdir)
  conf.env.append_value("LIB_LLVM", "clang")
  llvm_includedir = popen("%s --includedir" % llvm_config).readline().strip()
  conf.env.append_value("CPPPATH_LLVM", llvm_includedir)

def build(bld):
  obj = bld.new_task_gen("cxx", "shlib", "node_addon")
  obj.cxxflags = ["-g", "-D_FILE_OFFSET_BITS=64", "-D_LARGEFILE_SOURCE", "-Wall", "-O0"]
  obj.target = "libclang"
  obj.source = [
    "src/libclang.cc",
    "src/index.cc",
    "src/translation.cc",
    "src/ncursor.cc",
    "src/constants.cc",
    "src/type.cc",
    "src/location.cc",
  ]
  obj.uselib = ['LLVM']

def shutdown():
  if Options.commands['clean']:
    if exists('libclang.node'): unlink('libclang.node')
  else:
    if exists('build/default/libclang.node') and not exists('libclang.node'):
      symlink('build/default/libclang.node', 'libclang.node')
