class HashtagsOnPost {
  final int id;
  final int postId;
  final int hashtagId;
  final DateTime createdAt;
  DateTime updatedAt;

  HashtagsOnPost({
    required this.id,
    required this.postId,
    required this.hashtagId,
    required this.createdAt,
    required this.updatedAt,
  });
}
