import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';

import '../constants/jwtheader.dart';
import '../constants/localhost.dart';
import 'common/exeptions/jwttokenexeption.dart';
import 'common/functions/jwttoken.dart';

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

  static String? token;

  Hashtag.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        tag = data["tag"],
        color = Color(data["color"]),
        image = data["image"],
        description = data["description"],
        createdAt = DateTime.parse(data["createdAt"]),
        updatedAt = DateTime.parse(data["updatedAt"]);

  /* 
  * /:hashtagUUID - GET - get a hashtag by uuid
  */
  static Future<Hashtag?> getHashtag({required String hashtagUUID}) async {
    final Uri uri = Uri.https(localhost, "/hashtags/$hashtagUUID");
    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;
    return Hashtag.fromMap(map);
  }

  /* 
  * /:userUUID - POST - create a hashtag
  */
  static void createHashtag({
    required Map<String, dynamic> body,
    required String userUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/hashtags/");
    await post(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:userUUID/tag/:hashtagUUID - PUT - update a hashtag
  */
  static void updateHashtag({
    required Map<String, dynamic> body,
    required String hashtagUUID,
    required String userUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/hashtags/$hashtagUUID");
    await put(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:userUUID/tag/:hashtagUUID - DELETE - delete a hashtag
  */
  static void deleteHashtag({
    required String hashtagUUID,
    required String userUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/hashtags/$hashtagUUID");
    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:hashtagUUID/moderators/:moderatorUUID - POST - add a hashtag moderator
  */
  static void addModerator({
    required String hashtagUUID,
    required String moderatorUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(
      localhost,
      "/hashtags/$hashtagUUID/moderators/$moderatorUUID",
    );

    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:hashtagUUID/moderators/:moderatorUUID - POST - remove a hashtag moderator
  */
  static void removeModerator({
    required String hashtagUUID,
    required String moderatorUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(
      localhost,
      "/hashtags/$hashtagUUID/moderators/$moderatorUUID",
    );

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:hashtagUUID/moderators - GET - get all moderators of hashtag
  */
  static void getAllModerators({
    required String hashtagUUID,
    int limit = 10,
    int offset = 0,
  }) async {
    final Uri uri = Uri.https(
      localhost,
      "/hashtags/$hashtagUUID/moderators?limit=$limit&offset=$offset",
    );

    await get(uri);
  }
}
