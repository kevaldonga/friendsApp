import 'package:flutter/material.dart';

class Hashtag {
  final int id;
  final String tag;
  String description;
  Color color;
  String image;
  final DateTime createdAt;
  DateTime updatedAt;

  Hashtag({
    required this.id,
    required this.tag,
    required this.description,
    required this.color,
    required this.image,
    required this.createdAt,
    required this.updatedAt,
  });

  Hashtag.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        tag = data["tag"],
        color = Color(data["color"]),
        image = data["image"],
        description = data["description"],
        createdAt = DateTime.parse(data["createdAt"]),
        updatedAt = DateTime.parse(data["updatedAt"]);
}
