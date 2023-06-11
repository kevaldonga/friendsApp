class Comment {
  final int id;
  final int profileId;
  final int postId;
  int likeCount;

  Comment({
    required this.id,
    required this.profileId,
    required this.postId,
    this.likeCount = 0,
  });
}
