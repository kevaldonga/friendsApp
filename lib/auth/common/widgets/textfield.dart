import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
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
        double? size = inputType == InputType.otp
            ? MediaQuery.of(context).size.width * 0.12
            : null;
        return SizedBox(
          width: size,
          height: inputType == InputType.username ? null : size,
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
              maxLines: inputType == InputType.bio ? null : 1,
              onSubmitted: onSubmitted,
              decoration: InputDecoration(
                errorText: getErrorText(textfieldprovider),
                counterText: getCounterText(textfieldprovider),
                suffixIcon: getSuffixIcon(textfieldprovider),
                prefixIconConstraints: const BoxConstraints(maxWidth: 50),
                prefixIcon: getPrefixIcon(textfieldprovider, context),
                prefixIconColor: textfieldprovider.focusnode.hasFocus
                    ? MyColors.accentColor
                    : MyColors.greyColorShade,
                prefixStyle: TextStyles.labelText,
                hintText: hintText,
                hintStyle: TextStyles.hintText,
                errorStyle: inputType == InputType.otp
                    ? TextStyles.hintText.copyWith(fontSize: 0)
                    : null,
                border: inputType == InputType.bio ||
                        inputType == InputType.username ||
                        inputType == InputType.otp
                    ? authTextFieldBorderStyleNone
                    : authTextFieldBorderStyleUnfocused,
                focusedBorder: inputType == InputType.bio ||
                        inputType == InputType.username ||
                        inputType == InputType.otp
                    ? authTextFieldBorderStyleNone
                    : authTextFieldBorderStyleFocused,
                enabledBorder: inputType == InputType.bio ||
                        inputType == InputType.username ||
                        inputType == InputType.otp
                    ? authTextFieldBorderStyleNone
                    : authTextFieldBorderStyleUnfocused,
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
      case InputType.username:
        return TextInputType.name;
      case InputType.password:
        return null;
      case InputType.phoneno:
        return TextInputType.phone;
      case InputType.name:
        return TextInputType.name;
      case InputType.otp:
        return TextInputType.number;
      case InputType.bio:
        return TextInputType.multiline;
      default:
        return null;
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
                  ? MyColors.greyColorShade
                  : MyColors.accentColor,
            ),
          )
        : null;
  }

  String? getCounterText(TextFieldProvider textfieldprovider) {
    String? text;
    switch (inputType) {
      case InputType.password:
        text = "${textfieldprovider.text.length}";
        break;
      case InputType.bio:
        text = "${textfieldprovider.text.length}/200";
        break;
      case InputType.phoneno:
        text = "${textfieldprovider.text.length}/10";
        break;
      default:
        break;
    }
    return text;
  }

  Widget? getPrefixIcon(TextFieldProvider provider, BuildContext context) {
    Widget? innerWidget;
    switch (inputType) {
      case InputType.email:
        innerWidget = const Icon(
          FontAwesomeIcons.solidEnvelope,
        );
        break;
      case InputType.password:
        innerWidget = const Icon(
          FontAwesomeIcons.lock,
        );
        break;
      case InputType.phoneno:
        innerWidget = GestureDetector(
          onTap: () {
            pickCountryCode(context, (country) {
              provider.setCountryCode = "+${country.phoneCode}";
              onCountryCodeChanged!("+${country.phoneCode}");
            });
          },
          child: Text(
            provider.countryCode,
            style: TextStyles.labelText.copyWith(
                color: provider.focusnode.hasFocus
                    ? MyColors.accentColor
                    : Colors.black),
          ),
        );
        break;
      case InputType.username:
        innerWidget = Text("@",
            style: TextStyles.subtitleText.copyWith(
              color: provider.focusnode.hasFocus
                  ? MyColors.accentColor
                  : Colors.black,
            ));
        break;
      case InputType.bio:
        innerWidget = innerWidget = const Icon(
          FontAwesomeIcons.info,
        );
        break;
      default:
        innerWidget = null;
    }
    if (innerWidget == null) {
      return null;
    }
    return Center(
      child: innerWidget,
    );
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
      case InputType.username:
        return validateUsername(provider.text) ? null : "";
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
  username,
  bio,
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
