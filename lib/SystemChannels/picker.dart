import 'dart:developer';
import 'dart:io';

import 'package:flutter/services.dart';

class Picker {
  static const _channel = MethodChannel("flutter.io/picker");

  static void pickFile(
      {bool multiple = false, required Function(File? file) onResult}) async {
    String path =
        await _channel.invokeMethod("filepicker", {"multiple": multiple});
    log("file picked $path");
    onResult(File(path));
  }

  static void pickImage({
    bool multiple = false,
    required void Function(File? file) onResult,
  }) async {
    var path =
        await _channel.invokeMethod("imagepicker", {"multiple": multiple});
    log("image picked $path");
    onResult(File(path));
  }
}
