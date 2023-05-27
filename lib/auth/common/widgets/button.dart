import 'package:flutter/material.dart';
import 'package:friendsapp/auth/static/buttonstyles.dart';
import 'package:friendsapp/static/textstyles.dart';

class AuthButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String text;
  const AuthButton({
    super.key,
    this.onPressed,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    MediaQueryData md = MediaQuery.of(context);
    return SizedBox(
      width: md.size.width,
      height: md.size.height * 0.05,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ButtonStyles.authButton,
        child: Text(
          text,
          style: TextStyles.authButtonText,
        ),
      ),
    );
  }
}
