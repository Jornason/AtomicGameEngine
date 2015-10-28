var fs = require('fs-extra');
var bcommon = require("./BuildCommon");
var host = require("./Host");

var buildDir = bcommon.artifactsRoot + "Build/Android/";
var playerBuildDir = buildDir + "AtomicPlayer/";

namespace('build', function() {

  task('android_player', {
    async: true
  }, function() {

    bcommon.cleanCreateDir(playerBuildDir);

    var atomicTool = host.getAtomicToolBinary();

    process.chdir(playerBuildDir);

    var cmds = [
      atomicTool + " bind " + bcommon.atomicRoot + " Script/Packages/Atomic/ ANDROID",
      atomicTool + " bind " + bcommon.atomicRoot + " Script/Packages/AtomicPlayer/ ANDROID"
    ];

    cmds.push("cmake -G \"Unix Makefiles\" -DCMAKE_TOOLCHAIN_FILE=" + bcommon.atomicRoot + "/CMake/Toolchains/android.toolchain.cmake -DCMAKE_BUILD_TYPE=Release ../../../../");
    cmds.push("make -j4");

    jake.exec(cmds, function() {

      console.log("Built Android Player");

      var androidPlayerBinary = playerBuildDir + "Source/AtomicPlayer/Application/libAtomicPlayer.so";
      fs.copySync(androidPlayerBinary, buildDir + "Bin/libAtomicPlayer.so");

      complete();

    }, {
      printStdout: true
    });

  });

}); // end of build namespace
