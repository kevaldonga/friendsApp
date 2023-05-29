import 'package:flutter/material.dart';
import 'package:friendsapp/static/colors.dart';
import 'package:friendsapp/static/textstyles.dart';

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
    return InkWell(
      highlightColor: Colors.transparent,
      splashColor: MyColors.splashColor,
      focusColor: MyColors.focusColor,
      onTap: onPressed,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 50,
        width: md.size.width * 0.4,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color.fromARGB(255, 197, 197, 197),
            width: 1,
          ),
        ),
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
