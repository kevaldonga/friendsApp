import 'package:flutter/material.dart';
import 'package:friendsapp/auth/static/textfieldinputborders.dart';
import 'package:friendsapp/static/colors.dart';
import 'package:friendsapp/static/textstyles.dart';

class ButtonStyles {
  static final ButtonStyle authButton = ButtonStyle(
    backgroundColor:
        const MaterialStatePropertyAll<Color>(MyColors.accentColor),
    shape: MaterialStateProperty.all<RoundedRectangleBorder>(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14.0),
      ),
    ),
    textStyle: const MaterialStatePropertyAll(TextStyles.authButtonText),
  );

  static final ButtonStyle authButtonDisabled = ButtonStyle(
    backgroundColor:
        const MaterialStatePropertyAll<Color>(MyColors.accentColorDisabled),
    shape: MaterialStateProperty.all<RoundedRectangleBorder>(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14.0),
      ),
    ),
    textStyle: const MaterialStatePropertyAll(TextStyles.authButtonText),
  );

  static final ButtonStyle otherauth = ButtonStyle(
    backgroundColor: const MaterialStatePropertyAll<Color>(Colors.white),
    shape: MaterialStateProperty.all<RoundedRectangleBorder>(
      RoundedRectangleBorder(
        side: authTextFieldBorderStyleUnfocused.borderSide.copyWith(width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    textStyle: const MaterialStatePropertyAll(TextStyles.labelText),
  );
}
