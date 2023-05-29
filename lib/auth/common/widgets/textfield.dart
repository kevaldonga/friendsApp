import 'package:flutter/material.dart';
import 'package:friendsapp/auth/common/widgets/pickcountrycode.dart';
import 'package:friendsapp/auth/static/textfieldinputborders.dart';
import 'package:friendsapp/static/colors.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:provider/provider.dart';

import '../functions/validations.dart';

class AuthTextField extends StatelessWidget {
  final String? hintText;
  final InputType? inputType;
  final int? maxLength;
  final void Function(String value) onChanged;
  final void Function(String value)? onSubmitted;
  final void Function(String value)? onCountryCodeChanged;
  final FocusNode focusnode;

  const AuthTextField({
    super.key,
    this.hintText,
    this.inputType,
    this.maxLength,
    this.onSubmitted,
    this.onCountryCodeChanged,
    required this.focusnode,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => TextFieldProvider(focusnode: focusnode),
      child:
          Consumer<TextFieldProvider>(builder: (context, textfieldprovider, _) {
        return SizedBox(
          width: inputType == InputType.otp
              ? MediaQuery.of(context).size.width * 0.12
              : null,
          height: inputType == InputType.otp
              ? MediaQuery.of(context).size.width * 0.12
              : null,
          child: Focus(
            focusNode: FocusNode(),
            onFocusChange: (value) => textfieldprovider.isFocused = value,
            child: TextField(
              focusNode: textfieldprovider.focusnode,
              textAlign: inputType == InputType.otp
                  ? TextAlign.center
                  : TextAlign.start,
              showCursor: inputType != InputType.otp,
              maxLength: maxLength,
              keyboardType: getKeyboardType(inputType),
              style: TextStyles.labelText,
              obscureText: inputType == InputType.password &&
                  !textfieldprovider.isVisible,
              onChanged: (value) {
                textfieldprovider.setText = value;
                onChanged(value);
              },
              onSubmitted: onSubmitted,
              decoration: InputDecoration(
                errorText: getErrorText(textfieldprovider),
                counterText: getCounterText(textfieldprovider),
                suffixIcon: getSuffixIcon(textfieldprovider),
                prefixIconConstraints: const BoxConstraints(maxWidth: 50),
                prefixIcon: getCountryCodeWidget(textfieldprovider, context),
                prefixStyle: TextStyles.labelText,
                hintText: hintText,
                hintStyle: TextStyles.hintText,
                errorStyle: inputType == InputType.otp
                    ? TextStyles.hintText.copyWith(fontSize: 0)
                    : null,
                border: authTextFieldBorderStyleUnfocused,
                focusedBorder: authTextFieldBorderStyleFocused,
                enabledBorder: authTextFieldBorderStyleUnfocused,
                errorBorder: authTextFieldBorderStyleError,
                focusedErrorBorder: authTextFieldBorderStyleErrorFocused,
                filled: true,
                fillColor: textfieldprovider.isFocused
                    ? MyColors.authTextfieldBackgroundFocused
                    : MyColors.authTextfieldBackgroundUnfocused,
              ),
            ),
          ),
        );
      }),
    );
  }

  TextInputType? getKeyboardType(InputType? inputType) {
    if (inputType == null) {
      return null;
    }
    switch (inputType) {
      case InputType.email:
        return TextInputType.emailAddress;
      case InputType.password:
        return null;
      case InputType.phoneno:
        return TextInputType.phone;
      case InputType.name:
        return TextInputType.name;
      case InputType.otp:
        return TextInputType.number;
    }
  }

  Widget? getSuffixIcon(TextFieldProvider textfieldprovider) {
    return inputType == InputType.password
        ? IconButton(
            splashColor: Colors.transparent,
            onPressed: () {
              textfieldprovider.isVisible = !textfieldprovider.isVisible;
            },
            icon: Icon(
              textfieldprovider.isVisible
                  ? Icons.visibility_rounded
                  : Icons.visibility_off_rounded,
              color: !textfieldprovider.isVisible
                  ? Colors.grey.shade300
                  : MyColors.accentColor,
            ),
          )
        : null;
  }

  String? getCounterText(TextFieldProvider textfieldprovider) {
    return inputType == InputType.password
        ? "${textfieldprovider.text.length}"
        : inputType == InputType.phoneno
            ? "${textfieldprovider.text.length}/10"
            : "";
  }

  Widget? getCountryCodeWidget(
      TextFieldProvider provider, BuildContext context) {
    return inputType == InputType.phoneno
        ? Center(
            child: GestureDetector(
              onTap: () {
                pickCountryCode(context, (country) {
                  provider.setCountryCode = "+${country.phoneCode}";
                  onCountryCodeChanged!("+${country.phoneCode}");
                });
              },
              child: Text(
                provider.countryCode,
                style: TextStyles.labelText,
              ),
            ),
          )
        : null;
  }

  String? getErrorText(TextFieldProvider provider) {
    if (provider.text.isEmpty) {
      return null;
    }
    switch (inputType) {
      case InputType.email:
        return validateEmail(provider.text) ? null : "invalid format !";
      case InputType.password:
        return validatePassword(provider.text)
            ? null
            : "password is too short !";

      case InputType.phoneno:
        return provider.text.length < 10
            ? "phoneno is too short !"
            : validatePhoneno(provider.text)
                ? null
                : "invalid input !";
      case InputType.otp:
        return validateOtp(provider.text)
            // otp textfield is small so it wont fit
            // so we just show error border
            ? null
            : "";
      default:
        break;
    }
    return null;
  }
}

enum InputType {
  email,
  password,
  phoneno,
  name,
  otp,
}

class TextFieldProvider extends ChangeNotifier {
  bool _passvisibility = false;
  bool _isTextFieldFocused = false;
  String _text = "";
  String _countryCode = "+91";
  FocusNode focusnode;

  TextFieldProvider({required this.focusnode});

  bool get isFocused => _isTextFieldFocused;

  bool get isVisible => _passvisibility;

  String get text => _text;

  String get countryCode => _countryCode;

  set isFocused(bool focused) {
    _isTextFieldFocused = focused;
    notifyListeners();
  }

  set isVisible(bool visible) {
    _passvisibility = visible;
    notifyListeners();
  }

  set setText(String text) {
    _text = text;
    notifyListeners();
  }

  set setCountryCode(String countryCode) {
    _countryCode = countryCode;
    notifyListeners();
  }
}
