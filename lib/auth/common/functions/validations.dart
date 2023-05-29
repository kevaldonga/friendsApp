import 'package:email_validator/email_validator.dart';

bool validatePassword(String text) {
  return text.length >= 8;
}

bool validateEmail(String text) {
  return EmailValidator.validate(text);
}

bool validatePhoneno(String text) {
  return !RegExp(r'[a-zA-Z]').hasMatch(text) && text.length == 10;
}

bool validateOtp(String text) {
  return !RegExp(r'[a-zA-Z]').hasMatch(text);
}
