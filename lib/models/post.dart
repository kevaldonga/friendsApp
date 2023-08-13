import 'dart:convert';

import 'package:friendsapp/models/hashtag.dart';
import 'package:friendsapp/models/profile.dart';
import 'package:http/http.dart';

import '../constants/jwtheader.dart';
import '../constants/localhost.dart';
import 'common/exeptions/jwttokenexeption.dart';
import 'common/functions/jwttoken.dart';

class Post {
  final int id;
  final int profileUUID;
  String title;
  String media;
  int likesCount;
  int commentsCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Post({
    required this.id,
    required this.profileUUID,
    required this.title,
    required this.media,
    required this.createdAt,
    required this.updatedAt,
    this.likesCount = 0,
    this.commentsCount = 0,
  });

  static String? token;

  Post.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        profileUUID = int.parse(data["profileUUID"]),
        title = data["title"],
        media = data["media"],
        likesCount = int.parse(data["likesCount"]),
        commentsCount = int.parse(data["commentsCount"]),
        createdAt = DateTime.parse(data["createdAt"]!),
        updatedAt = DateTime.parse(data["updatedAt"]!);

  /* 
  * /:postUUID - GET - get a post
  */
  Future<Post?> getPost({required String postUUID}) async {
    Uri uri = Uri.https(localhost, "/posts/$postUUID");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;

    return Post.fromMap(map);
  }

  /* 
  * / - POST - create a post
  */
  void createPost({required Map<String, dynamic> body}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/posts/");

    await post(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:postUUID - PUT - update a post
  */
  void updatePost({
    required String postUUID,
    required Map<String, dynamic> body,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/posts/$postUUID");

    await put(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:postUUID - DELETE - delete a post
  */
  void deletePost({required String postUUID}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/posts/$postUUID");

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /*
  * /:profileUUID/posts - GET - get all posts of a profile
  */
  Future<List<Post?>> getPostsOfProfile({
    required String profileUUID,
    int limit = 10,
    int offset = 0,
  }) async {
    Uri uri = Uri.https(
      localhost,
      "/posts/$profileUUID/posts?limit=$limit&offset=$offset",
    );

    Response response = await get(uri);

    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Post> posts = [];

    for (int i = 0; i < list.length; i++) {
      posts.add(Post.fromMap(list[i]));
    }
    return posts;
  }

  /*
  * /:postUUID/hashtags - GET - get all hashtags of a post
  */
  Future<List<Hashtag?>> getHashtags({
    required String postUUID,
    int limit = 10,
    int offset = 0,
  }) async {
    Uri uri = Uri.https(
      localhost,
      "/posts/$postUUID/hashtags?limit=$limit&offset=$offset",
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
  * /:postUUID/hashtags/:hashtagUUID - POST - add a hashtag in a post
  */
  void addHashtag({
    required String postUUID,
    required String hashtagUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/posts/$postUUID/hashtags/$hashtagUUID");

    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:postUUID/hashtags/:hashtagUUID - DELETE - remove a hashtag in a post
  */
  void removeHashtag({
    required String postUUID,
    required String hashtagUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    Uri uri = Uri.https(localhost, "/posts/$postUUID/hashtags/$hashtagUUID");

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /*
  * /:postUUID/likes - GET - get likes of a post
  */
  static Future<List<Profile?>> viewLikes({
    required String postUUID,
    int limit = 10,
    int offset = 0,
  }) async {
    final Uri uri = Uri.https(
      localhost,
      "/posts/$postUUID/likes?limit=$limit&offset=$offset",
    );

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Profile> profiles = [];

    for (int i = 0; i < list.length; i++) {
      profiles.add(Profile.fromMap(list[i]));
    }
    return profiles;
  }

  /* 
  * /:postUUID/likes/:profileUUID - POST - like a post
  */
  static void likePost({
    required String postUUID,
    required String profileUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/posts/$postUUID/likes/$profileUUID");
    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /*
  * /:storyId/likes/:profileUUID - DELETE - unlike a post
  */
  static void unlikePost({
    required String postUUID,
    required String profileUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/posts/$postUUID/likes/$profileUUID");
    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }
}
