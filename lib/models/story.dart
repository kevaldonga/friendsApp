import 'dart:convert';

import 'package:friendsapp/constants/localhost.dart';
import 'package:friendsapp/models/hashtag.dart';
import 'package:friendsapp/models/profile.dart';
import 'package:http/http.dart';

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
    final Uri uri = Uri.https(localhost, "stories/");
    await post(uri);
  }

  /* 
  * /:storyId - get a story
  */
  static Future<Story?> getStory({required int storyId}) async {
    final Uri uri = Uri.https(localhost, "stories/$storyId");

    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;
    return Story.fromMap(map);
  }

  /*
  * /profiles/:profileId - GET - get all stories of profile
  */
  static Future<List<Story?>> getStoriesOfProfile({
    required int profileId,
  }) async {
    final Uri uri = Uri.https(localhost, "/stories/profiles/$profileId");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Story> stories = [];

    for (int i = 0; i < list.length; i++) {
      stories.add(Story.fromMap(list[i]));
    }
    return stories;
  }

  /* 
  * /:storyId - PUT - update a story
  */
  static void updateStory({
    required int storyId,
    required Map<String, dynamic> body,
  }) async {
    final Uri uri = Uri.https(localhost, "stories/$storyId");

    await put(uri, body: body);
  }

  /* 
  * /:storyId - DELETE - delete a story
  */
  static void deleteStory({required int storyId}) async {
    final Uri uri = Uri.https(localhost, "stories/$storyId");

    await delete(uri);
  }

  /* 
  * /:storyId/hashtags - GET - get all hashtags of a story
  */
  static Future<List<Hashtag?>> getHashtags({
    required int storyId,
  }) async {
    final Uri uri = Uri.https(localhost, "/stories/$storyId/hashtags");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Hashtag> hashtags = [];

    for (int i = 0; i < list.length; i++) {
      hashtags.add(Hashtag.fromMap(list[i]));
    }
    return hashtags;
  }

  /* 
  * /:storyId/hashtags/:hashtagId - POST - add a hashtag in a story
  */
  static void addHashtag({
    required int storyId,
    required int hashtagId,
  }) async {
    final Uri uri = Uri.https(
      localhost,
      "/stories/$storyId/hashtags/$hashtagId",
    );
    await post(uri);
  }

  /* 
  * /:storyId/hashtags/:hashtagId - DELETE - remove a hashtag in a story
  */
  static void removeHashtag({
    required int storyId,
    required int hashtagId,
  }) async {
    final Uri uri = Uri.https(
      localhost,
      "/stories/$storyId/hashtags/$hashtagId",
    );
    await delete(uri);
  }

  /*
  * /:storyId/likes - GET - get likes of a story
  */
  static Future<List<Profile?>> viewLikes({required int storyId}) async {
    final Uri uri = Uri.https(localhost, "/stories/$storyId/likes");

    Response response = await get(uri);
    final list = jsonDecode(response.body) as List<Map<String, dynamic>>;
    List<Profile> profiles = [];

    for (int i = 0; i < list.length; i++) {
      profiles.add(Profile.fromMap(list[i]));
    }
    return profiles;
  }

  /* 
  * /:storyId/likes/:profileId - POST - like a story
  */
  static void likeStory({required int storyId, required int profileId}) async {
    final Uri uri = Uri.https(
      localhost,
      "/stories/$storyId/likes/$profileId",
    );
    await post(uri);
  }

  /*
  * /:storyId/likes/:profileId - DELETE - unlike a story
  */
  static void unlikeStory({
    required int storyId,
    required int profileId,
  }) async {
    final Uri uri = Uri.https(localhost, "/stories/$storyId/likes/$profileId");
    await delete(uri);
  }
}
