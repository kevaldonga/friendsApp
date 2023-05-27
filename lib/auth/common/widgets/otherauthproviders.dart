import 'package:flutter/material.dart';
import 'package:friendsapp/static/textstyles.dart';

import '../../static/buttonstyles.dart';

class AuthProviderButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final String iconPath;
  const AuthProviderButton({
    super.key,
    this.onPressed,
    required this.text,
    required this.iconPath,
  });

  @override
  Widget build(BuildContext context) {
    MediaQueryData md = MediaQuery.of(context);
    return ElevatedButton(
      onPressed: onPressed,
      style: ButtonStyles.otherauth,
      child: SizedBox(
        height: 50,
        width: md.size.width * 0.35,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Image.asset(
              iconPath,
              fit: BoxFit.fitHeight,
              height: 30,
              width: 30,
            ),
            Text(
              text,
              style: TextStyles.labelText,
            ),
          ],
        ),
      ),
    );
  }
}
