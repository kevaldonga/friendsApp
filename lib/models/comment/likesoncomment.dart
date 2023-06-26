class LikesOnComment {
  final int id;
  final int commentId;
  final int postId;
  int count;

  LikesOnComment({
    required this.id,
    required this.commentId,
    required this.postId,
    this.count = 0,
  });
}
