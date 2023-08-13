import 'dart:convert';

import 'package:friendsapp/constants/localhost.dart';
import 'package:http/http.dart';

import '../constants/jwtheader.dart';
import 'common/exeptions/jwttokenexeption.dart';
import 'common/functions/jwttoken.dart';
import 'hashtag.dart';

class Profile {
  final int id;
  final int userId;
  String username;
  String bio;
  bool isActive;
  String? note;
  String? profileImg;
  final DateTime createdAt;
  DateTime updatedAt;

  Profile({
    required this.id,
    required this.userId,
    required this.username,
    required this.bio,
    required this.createdAt,
    required this.updatedAt,
    this.note,
    this.profileImg,
    this.isActive = false,
  });

  static String? token;

  Profile.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        userId = int.parse(data["userId"]),
        username = data["username"],
        bio = data["bio"],
        isActive = data["isActive"] ?? false,
        note = data["note"],
        profileImg = data["profileImg"],
        createdAt = DateTime.parse(data["createdAt"]),
        updatedAt = DateTime.parse(data["updatedAt"]);

  /*
  * /:profileUUID - GET - get a profile
  */
  Future<Profile?> getProfile({required String profileUUID}) async {
    Uri uri = Uri.https(localhost, "/profiles/$profileUUID");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;

    return Profile.fromMap(map);
  }

  /*
  * / - POST - create a profile
  */
  void createProfile({required Map<String, dynamic> body}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/profiles/");

    await post(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:profileUUID - PUT - update a profile
  */
  void updateProfile({
    required String profileUUID,
    required Map<String, dynamic> body,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/profiles/$profileUUID");

    await put(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:profileUUID - DELETE - delete a profile
  */
  void deleteProfile({required String profileUUID}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/profiles/$profileUUID");

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /*
  * /:profileUUID/hashtags - GET - get all hashtags of a profile
  */
  Future<List<Hashtag?>> getHashtags({
    required String profileUUID,
    int limit = 10,
    int offset = 0,
  }) async {
    Uri uri = Uri.https(
      localhost,
      "/profiles/$profileUUID/hashtags?limit=$limit&offset=$offset",
    );

    Response response = await get(uri);

    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Hashtag> hashtags = [];

    for (int i = 0; i < list.length; i++) {
      hashtags.add(Hashtag.fromMap(list[i]));
    }
    return hashtags;
  }

  /* 
  * /:profileUUID/hashtags/:hashtagUUID - POST - add a hashtag in a profile
  */
  void addHashtag({
    required String profileUUID,
    required String hashtagUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(
      localhost,
      "/profiles/$profileUUID/hashtags/$hashtagUUID",
    );

    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:profileUUID/hashtags/:hashtagUUID - DELETE - remove a hashtag from a profile
  */
  void removeHashtag({
    required String profileUUID,
    required String hashtagUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(
      localhost,
      "/profiles/$profileUUID/hashtags/$hashtagUUID",
    );

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }
}
