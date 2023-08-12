import 'dart:convert';

import 'package:friendsapp/constants/jwtheader.dart';
import 'package:friendsapp/models/common/functions/jwttoken.dart';
import 'package:friendsapp/models/profile.dart';
import 'package:http/http.dart';

import '../constants/localhost.dart';
import 'common/exeptions/jwttokenexeption.dart';

class Comment {
  final int id;
  final int profileId;
  final int postId;
  String comment;
  int likesCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Comment({
    required this.id,
    required this.profileId,
    required this.postId,
    required this.comment,
    this.likesCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  static String? token;

  Comment.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        profileId = int.parse(data["profileId"]),
        postId = int.parse(data["postId"]),
        comment = data["comment"],
        likesCount = int.parse(data["likesCount"]),
        createdAt = DateTime.parse(data["createdAt"]),
        updatedAt = DateTime.parse(data["updatedAt"]);

  /* 
  * / - POST - create a comment
  */
  void createComment({required Map<String, dynamic> body}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "comments/");

    await post(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:commentUUID - GET - get a comment
  */
  Future<Comment?> getComment({required String commentUUID}) async {
    Uri uri = Uri.https(localhost, "comments/$commentUUID");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;

    return Comment.fromMap(map);
  }

  /* 
  * /:commentUUID - DELETE - delete a comment
  */
  void deleteComment({required String commentUUID}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "comments/$commentUUID");

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:commentUUID - PUT - update a comment
  */
  void updateComment({
    required String commentUUID,
    required Map<String, dynamic> body,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/comments/$commentUUID");

    await put(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:postUUID/comments - GET - get all comments of post
  */
  Future<List<Comment?>> getComments({required String postUUID}) async {
    Uri uri = Uri.https(localhost, "comments/$postUUID/comments");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Comment> comments = [];

    for (int i = 0; i < list.length; i++) {
      comments.add(Comment.fromMap(list[i]));
    }
    return comments;
  }

  /* 
  * /:commentUUID/likes - GET - get likes on comment
  */
  Future<List<Profile?>> getLikes({required String commentUUID}) async {
    Uri uri = Uri.https(localhost, "comments/$commentUUID/likes");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Profile> profiles = [];

    for (int i = 0; i < list.length; i++) {
      profiles.add(Profile.fromMap(list[i]));
    }
    return profiles;
  }

  /* 
  * /:commentUUID/likes/:profileUUID - POST - like on a comment
  */
  void likeComment({
    required String profileUUID,
    required String commentUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "comments/$commentUUID/likes/$profileUUID");

    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:commentUUID/likes/:profileUUID - DELETE - unlike on a comment
  */
  void unlikeComment({
    required String profileUUID,
    required String commentUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "comments/$commentUUID/likes/$profileUUID");

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }
}
