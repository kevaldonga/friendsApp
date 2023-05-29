import 'package:country_picker/country_picker.dart';
import 'package:flutter/material.dart';

void pickCountryCode(
    BuildContext context, void Function(Country country) onSelect) {
  showCountryPicker(
    context: context,
    onSelect: onSelect,
    showPhoneCode: true,
    searchAutofocus: true,
  );
}
