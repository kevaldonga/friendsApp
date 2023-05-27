import 'package:flutter/material.dart';
import 'package:friendsapp/static/colors.dart';

const InputBorder authTextFieldBorderStyleUnfocused = OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(12)),
    borderSide: BorderSide(
      color: Color.fromARGB(255, 197, 197, 197),
      width: 2,
    ));

const InputBorder authTextFieldBorderStyleFocused = OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(12)),
    borderSide: BorderSide(
      color: MyColors.accentColor,
      width: 2,
    ));

const InputBorder authTextFieldBorderStyleError = OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(12)),
    borderSide: BorderSide(
      color: Colors.redAccent,
      width: 2,
    ));

const InputBorder authTextFieldBorderStyleErrorFocused = OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(12)),
    borderSide: BorderSide(
      color: Colors.red,
      width: 2,
    ));
