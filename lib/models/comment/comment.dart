class Comment {
  final int id;
  final int profileId;
  final int postId;
  String comment;
  int likeCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Comment({
    required this.id,
    required this.profileId,
    required this.postId,
    required this.comment,
    this.likeCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });
}
