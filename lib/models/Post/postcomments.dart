class PostComments {
  final int id;
  final int postId;
  final int profileId;
  int count;
  final DateTime createdAt;

  PostComments({
    required this.id,
    required this.postId,
    required this.profileId,
    required this.createdAt,
    this.count = 0,
  });
}
