import 'package:flutter/material.dart';

import 'alertdialogactionbutton.dart';

Future<bool> showMyDialog({
  required BuildContext context,
  Widget? title,
  Widget? contents,
  List<Widget>? actions,
  bool? barrierDismissible,
}) async {
  return await showDialog<bool>(
          context: context,
          barrierDismissible: barrierDismissible ?? false,
          builder: (ctx) {
            return AlertDialog(
              backgroundColor: Theme.of(context).dialogBackgroundColor,
              title: title,
              content: contents,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              actions: actions,
            );
          }) ??
      false;
}

Future<void> showBasicDialog(
    BuildContext context, String title, String contents,
    {String buttonText = "OK"}) async {
  await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: Theme.of(context).dialogBackgroundColor,
          title: Text(title),
          content: Text(contents),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          actions: [
            alertDialogActionButton(buttonText, () {
              Navigator.of(context).pop(true);
            }),
          ],
        );
      });
}
