import 'package:flutter/material.dart';
import 'package:friendsapp/auth/static/buttonstyles.dart';
import 'package:friendsapp/static/textstyles.dart';

class AuthButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String text;
  final bool disabled;
  const AuthButton({
    super.key,
    this.onPressed,
    required this.text,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    MediaQueryData md = MediaQuery.of(context);
    return SizedBox(
      width: md.size.width,
      height: md.size.height * 0.05,
      child: IgnorePointer(
        ignoring: disabled,
        child: ElevatedButton(
          onPressed: onPressed,
          style: !disabled
              ? ButtonStyles.authButton
              : ButtonStyles.authButtonDisabled,
          child: Text(
            text,
            style: TextStyles.authButtonText,
          ),
        ),
      ),
    );
  }
}
