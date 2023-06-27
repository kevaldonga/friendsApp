import 'dart:convert';

import 'package:friendsapp/constants/localhost.dart';
import 'package:http/http.dart';

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
  * /:profileId - GET - get a profile
  */
  Future<Profile?> getProfile({required int profileId}) async {
    Uri uri = Uri.https(localhost, "/profiles/$profileId");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;

    return Profile.fromMap(map);
  }

  /*
  * / - POST - create a profile
  */
  void createProfile({required Map<String, dynamic> body}) async {
    Uri uri = Uri.https(localhost, "/profiles/");

    await post(uri, body: body);
  }

  /* 
  * /:profileId - PUT - update a profile
  */
  void updateProfile({
    required int profileId,
    required Map<String, dynamic> body,
  }) async {
    Uri uri = Uri.https(localhost, "profiles/$profileId");

    await put(uri, body: body);
  }

  /* 
  * /:profileId - DELETE - delete a profile
  */
  void deleteProfile({required int profileId}) async {
    Uri uri = Uri.https(localhost, "/profiles/$profileId");

    await delete(uri);
  }

  /*
  * /:profileId/hashtags - GET - get all hashtags of a profile
  */
  Future<List<Hashtag?>> getHashtags({required int profileId}) async {
    Uri uri = Uri.https(localhost, "profiles/$profileId/hashtags");

    Response response = await get(uri);

    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Hashtag> hashtags = [];

    for (int i = 0; i < list.length; i++) {
      hashtags.add(Hashtag.fromMap(list[i]));
    }
    return hashtags;
  }

  /* 
  * /:profileId/hashtags/:hashtagId - POST - add a hashtag in a post
  */
  void addHashtag({required int profileId, required int hashtagId}) async {
    Uri uri = Uri.https(localhost, "profiles/$profileId/hashtags/$hashtagId");

    await post(uri);
  }

  /* 
  * /:profileId/hashtags/:hashtagId - DELETE - add a hashtag in a post
  */
  void removeHashtag({required int profileId, required int hashtagId}) async {
    Uri uri = Uri.https(localhost, "posts/$profileId/hashtags/$hashtagId");

    await delete(uri);
  }
}
