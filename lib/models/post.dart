import 'dart:convert';

import 'package:friendsapp/models/hashtag.dart';
import 'package:friendsapp/models/profile.dart';
import 'package:http/http.dart';

import '../constants/localhost.dart';

class Post {
  final int id;
  final int profileId;
  String title;
  String media;
  int likesCount;
  int commentsCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Post({
    required this.id,
    required this.profileId,
    required this.title,
    required this.media,
    required this.createdAt,
    required this.updatedAt,
    this.likesCount = 0,
    this.commentsCount = 0,
  });

  Post.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        profileId = int.parse(data["profileId"]),
        title = data["title"],
        media = data["media"],
        likesCount = int.parse(data["likesCount"]),
        commentsCount = int.parse(data["commentsCount"]),
        createdAt = DateTime.parse(data["createdAt"]!),
        updatedAt = DateTime.parse(data["updatedAt"]!);

  /* 
  * /:postId - GET - get a post
  */
  Future<Post?> getPost({required int postId}) async {
    Uri uri = Uri.https(localhost, "posts/$postId");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;

    return Post.fromMap(map);
  }

  /* 
  * / - POST - create a post
  */
  void createPost({required Map<String, dynamic> body}) async {
    Uri uri = Uri.https(localhost, "posts/");

    await post(uri, body: body);
  }

  /* 
  * /:postId - PUT - update a post
  */
  void updatePost({
    required int postId,
    required Map<String, dynamic> body,
  }) async {
    Uri uri = Uri.https(localhost, "posts/$postId");

    await put(uri, body: body);
  }

  /* 
  * /:postId - DELETE - delete a post
  */
  void deletePost({required int postId}) async {
    Uri uri = Uri.https(localhost, "posts/$postId");

    await delete(uri);
  }

  /*
  * /:profileId/posts - GET - get all posts of a profile
  */
  Future<List<Post?>> getPostsOfProfile({required int profileId}) async {
    Uri uri = Uri.https(localhost, "posts/$profileId/posts");

    Response response = await get(uri);

    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Post> posts = [];

    for (int i = 0; i < list.length; i++) {
      posts.add(Post.fromMap(list[i]));
    }
    return posts;
  }

  /*
  * /:postid/hashtags - GET - get all hashtags of a post
  */
  Future<List<Hashtag?>> getHashtags({required int postId}) async {
    Uri uri = Uri.https(localhost, "posts/$postId/hashtags");

    Response response = await get(uri);

    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Hashtag> hashtags = [];

    for (int i = 0; i < list.length; i++) {
      hashtags.add(Hashtag.fromMap(list[i]));
    }
    return hashtags;
  }

  /* 
  * /:postId/hashtags/:hashtagId - POST - add a hashtag in a post
  */
  void addHashtag({required int postId, required int hashtagId}) async {
    Uri uri = Uri.https(localhost, "posts/$postId/hashtags/$hashtagId");

    await post(uri);
  }

  /* 
  * /:postId/hashtags/:hashtagId - DELETE - add a hashtag in a post
  */
  void removeHashtag({required int postId, required int hashtagId}) async {
    Uri uri = Uri.https(localhost, "posts/$postId/hashtags/$hashtagId");

    await delete(uri);
  }

  /*
  * /:postId/likes - GET - get likes of a post
  */
  static Future<List<Profile?>> viewLikes({required int postId}) async {
    final Uri uri = Uri.https(localhost, "/posts/$postId/likes");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Profile> profiles = [];

    for (int i = 0; i < list.length; i++) {
      profiles.add(Profile.fromMap(list[i]));
    }
    return profiles;
  }

  /* 
  * /:postId/likes/:profileId - POST - like a story
  */
  static void likePost({required int postId, required int profileId}) async {
    final Uri uri = Uri.https(localhost, "/stories/$postId/likes/$profileId");
    await post(uri);
  }

  /*
  * /:storyId/likes/:profileId - DELETE - unlike a story
  */
  static void unlikePost({
    required int postId,
    required int profileId,
  }) async {
    final Uri uri = Uri.https(localhost, "/stories/$postId/likes/$profileId");
    await delete(uri);
  }
}
