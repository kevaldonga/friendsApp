import 'package:flutter/material.dart';
import 'package:friendsapp/static/colors.dart';

class TextStyles {
  static const titleText = TextStyle(
    color: Colors.black,
    fontSize: 21,
    fontWeight: FontWeight.w600,
  );
  static const descriptionText = TextStyle(
    color: Colors.black,
    fontSize: 13,
    fontWeight: FontWeight.w300,
  );
  static const labelText = TextStyle(
    color: Colors.black,
    fontSize: 16,
    fontWeight: FontWeight.w500,
  );
  static const authButtonText = TextStyle(
    color: Colors.white,
    fontSize: 18,
    fontWeight: FontWeight.w500,
  );
  static const hintText = TextStyle(
    color: Color.fromARGB(255, 164, 164, 164),
    fontSize: 16,
    fontWeight: FontWeight.w400,
  );
  static const subtitleText = TextStyle(
    color: Colors.black,
    fontSize: 16,
    fontWeight: FontWeight.w500,
  );
  static const highlightedBoldText = TextStyle(
    color: MyColors.accentColor,
    fontSize: 14,
    fontWeight: FontWeight.w600,
  );
}
