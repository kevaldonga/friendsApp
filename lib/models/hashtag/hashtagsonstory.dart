class HashtagsOnStory {
  final int id;
  final int storyId;
  final int hashtagId;
  final DateTime createdAt;
  DateTime updatedAt;

  HashtagsOnStory({
    required this.id,
    required this.storyId,
    required this.hashtagId,
    required this.createdAt,
    required this.updatedAt,
  });
}
