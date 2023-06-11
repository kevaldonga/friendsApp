import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import '../../static/colors.dart';

Widget avatar(
  MediaQueryData md, {
  File? file,
  String? url,
  bool editable = true,
  VoidCallback? onEditTapped,
}) {
  return GestureDetector(
    onTap: editable ? onEditTapped : null,
    child: Stack(
      children: [
        Hero(
          tag: url.toString(),
          transitionOnUserGestures: true,
          child: ClipOval(
            child: Container(
              decoration: BoxDecoration(
                color: MyColors.accentColor.withOpacity(0.2),
              ),
              width: md.size.width / 3,
              height: md.size.width / 3,
              child: file == null
                  ? url == null || url == "null"
                      ? const Icon(
                          FontAwesomeIcons.solidUser,
                          color: MyColors.accentColor,
                          size: 70,
                        )
                      : CachedNetworkImage(imageUrl: url, fit: BoxFit.cover)
                  : Image.file(file, fit: BoxFit.cover),
            ),
          ),
        ),
        if (editable)
          Positioned(
            bottom: 0,
            right: 4,
            child: buildcircle(
              color: Colors.white,
              padding: 4,
              child: buildcircle(
                color: MyColors.accentColor,
                padding: 10,
                child: const Icon(Icons.edit, size: 20, color: Colors.white),
              ),
            ),
          ),
      ],
    ),
  );
}

Widget buildcircle({required color, required double padding, Widget? child}) {
  return ClipOval(
    child: Container(
      color: color,
      padding: EdgeInsets.all(padding),
      child: child,
    ),
  );
}
