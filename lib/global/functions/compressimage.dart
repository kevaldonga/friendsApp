import 'dart:io';

import 'package:flutter_native_image/flutter_native_image.dart';

Future<File> compressImage(File file, int quality) async {
  return await FlutterNativeImage.compressImage(file.path, quality: quality);
}
