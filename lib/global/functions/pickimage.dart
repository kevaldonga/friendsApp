import 'dart:io';

import 'package:permission_handler/permission_handler.dart';

import '../../SystemChannels/picker.dart';
import '../../SystemChannels/toast.dart';

void pickImage(Function(File? file) onResult) async {
  if (await Permission.storage.isPermanentlyDenied) {
    Toast("please allow storage permission to work with us !");
  }
  if (await Permission.storage.isDenied) {
    await Permission.storage.request().then((value) {
      if (value.isGranted) {
        Picker.pickImage(onResult: onResult);
      } else {
        Toast("you have to allow storage permission to pick image !!");
      }
    });
  } else {
    Picker.pickImage(onResult: onResult);
  }
}
