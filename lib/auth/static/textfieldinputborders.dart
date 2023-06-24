import 'package:flutter/material.dart';
import 'package:friendsapp/static/colors.dart';

InputBorder authTextFieldBorderStyleUnfocused = OutlineInputBorder(
    borderRadius: const BorderRadius.all(Radius.circular(12)),
    borderSide: BorderSide(
      color: MyColors.lightGrey,
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

const InputBorder authTextFieldBorderStyleNone = OutlineInputBorder(
    borderRadius: BorderRadius.all(Radius.circular(12)),
    borderSide: BorderSide(
      color: Colors.transparent,
      width: 2,
    ));
