import 'dart:convert';

import 'package:friendsapp/models/profile.dart';
import 'package:http/http.dart';

import '../constants/localhost.dart';

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
    Uri uri = Uri.https(localhost, "comments/");

    await post(uri, body: body);
  }

  /* 
  * /:commentId - GET - get a comment
  */
  Future<Comment?> getComment({required int commentId}) async {
    Uri uri = Uri.https(localhost, "comments/$commentId");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;

    return Comment.fromMap(map);
  }

  /* 
  * /:commentId - DELETE - delete a comment
  */
  void deleteComment({required int commentId}) async {
    Uri uri = Uri.https(localhost, "comments/$commentId");

    await delete(uri);
  }

  /* 
  * /:commentId - PUT - update a comment
  */
  void updateComment(
      {required int commentId, required Map<String, dynamic> body}) async {
    Uri uri = Uri.https(localhost, "/comments/$commentId");

    await put(uri, body: body);
  }

  /* 
  * /:postId/comments - GET - get all comments of post
  */
  Future<List<Comment?>> getComments({required int postId}) async {
    Uri uri = Uri.https(localhost, "comments/$postId/comments");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Comment> comments = [];

    for (int i = 0; i < list.length; i++) {
      comments.add(Comment.fromMap(list[i]));
    }
    return comments;
  }

  /* 
  * /:commentId/likes - GET - get likes on comment
  */
  Future<List<Profile?>> getLikes({required int commentId}) async {
    Uri uri = Uri.https(localhost, "comments/$commentId/likes");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Profile> profiles = [];

    for (int i = 0; i < list.length; i++) {
      profiles.add(Profile.fromMap(list[i]));
    }
    return profiles;
  }

  /* 
  * /:commentId/likes/:profileId - POST - like on a comment
  */
  void likeComment({required int profileId, required int commentId}) async {
    Uri uri = Uri.https(localhost, "comments/$commentId/likes/$profileId");

    await post(uri);
  }

  /* 
  * /:commentId/likes/:profileId - DELETE - like on a comment
  */
  void unlikeComment({required int profileId, required int commentId}) async {
    Uri uri = Uri.https(localhost, "comments/$commentId/likes/$profileId");

    await delete(uri);
  }
}
