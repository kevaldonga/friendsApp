// ignore_for_file: invalid_use_of_visible_for_testing_member

import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../SystemChannels/toast.dart';

void clickPhoto(Function(File? file) onResult) async {
  if (await Permission.camera.isPermanentlyDenied) {
    Toast("please allow storage permission to work with us !");
  }
  if (await Permission.camera.isDenied) {
    await Permission.storage.request().then((value) {
      if (value.isGranted) {
        ImagePicker.platform.pickImage(source: ImageSource.camera).then((file) {
          if (file == null) return;
          onResult(File(file.path));
        });
      } else {
        Toast("you have to allow storage permission to pick image !!");
      }
    });
  } else {
    ImagePicker.platform.pickImage(source: ImageSource.camera).then((file) {
      if (file == null) return;
      onResult(File(file.path));
    });
  }
}
