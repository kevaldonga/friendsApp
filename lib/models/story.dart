import 'dart:convert';

import 'package:friendsapp/constants/jwtheader.dart';
import 'package:friendsapp/constants/localhost.dart';
import 'package:friendsapp/models/hashtag.dart';
import 'package:friendsapp/models/profile.dart';
import 'package:http/http.dart';

import 'common/exeptions/jwttokenexeption.dart';
import 'common/functions/jwttoken.dart';

class Story {
  final int id;
  final int profileId;
  String media;
  String? description;
  int likesCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Story({
    required this.id,
    required this.profileId,
    required this.media,
    required this.description,
    this.likesCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  static String? token;

  Story.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        profileId = int.parse(data["profileId"]),
        media = data["media"],
        description = data["description"],
        likesCount = int.parse(data["likesCount"]),
        createdAt = DateTime.parse(data["createdAt"]),
        updatedAt = DateTime.parse(data["updatedAt"]);

  /*
  / - POST - create a story
  */
  static void createStory({required Map<String, dynamic> body}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "stories/");
    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:storyUUID - get a story
  */
  static Future<Story?> getStory({required String storyUUID}) async {
    final Uri uri = Uri.https(localhost, "stories/$storyUUID");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;
    return Story.fromMap(map);
  }

  /*
  * /profiles/:profileUUID - GET - get all stories of profile
  */
  static Future<List<Story?>> getStoriesOfProfile(
      {required String profileUUID}) async {
    final Uri uri = Uri.https(localhost, "/stories/profiles/$profileUUID");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Story> stories = [];

    for (int i = 0; i < list.length; i++) {
      stories.add(Story.fromMap(list[i]));
    }
    return stories;
  }

  /* 
  * /:storyUUID - PUT - update a story
  */
  static void updateStory({
    required String storyUUID,
    required Map<String, dynamic> body,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "stories/$storyUUID");

    await put(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:storyUUID - DELETE - delete a story
  */
  static void deleteStory({required String storyUUID}) async {
    final Uri uri = Uri.https(localhost, "stories/$storyUUID");

    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:storyUUID/hashtags - GET - get all hashtags of a story
  */
  static Future<List<Hashtag?>> getHashtags({required String storyUUID}) async {
    final Uri uri = Uri.https(localhost, "/stories/$storyUUID/hashtags");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Hashtag> hashtags = [];

    for (int i = 0; i < list.length; i++) {
      hashtags.add(Hashtag.fromMap(list[i]));
    }
    return hashtags;
  }

  /* 
  * /:storyUUID/hashtags/:hashtagUUID - POST - add a hashtag in a story
  */
  static void addHashtag({
    required String storyUUID,
    required String hashtagUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(
      localhost,
      "/stories/$storyUUID/hashtags/$hashtagUUID",
    );
    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:storyUUID/hashtags/:hashtagUUID - DELETE - remove a hashtag in a story
  */
  static void removeHashtag({
    required String storyUUID,
    required String hashtagUUID,
  }) async {
    final Uri uri = Uri.https(
      localhost,
      "/stories/$storyUUID/hashtags/$hashtagUUID",
    );
    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /*
  * /:storyUUID/likes - GET - get likes of a story
  */
  static Future<List<Profile?>> viewLikes({required String storyUUID}) async {
    final Uri uri = Uri.https(localhost, "/stories/$storyUUID/likes");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Profile> profiles = [];

    for (int i = 0; i < list.length; i++) {
      profiles.add(Profile.fromMap(list[i]));
    }
    return profiles;
  }

  /* 
  * /:storyUUID/likes/:profileUUID - POST - like a story
  */
  static void likeStory({
    required String storyUUID,
    required String profileUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(
      localhost,
      "/stories/$storyUUID/likes/$profileUUID",
    );
    await post(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /*
  * /:storyUUID/likes/:profileUUID - DELETE - unlike a story
  */
  static void unlikeStory({
    required String storyUUID,
    required String profileUUID,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri =
        Uri.https(localhost, "/stories/$storyUUID/likes/$profileUUID");
    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }
}
