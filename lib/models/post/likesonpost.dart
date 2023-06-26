class LikesOnPost {
  final int id;
  final int postId;
  final int profileId;
  int count;

  LikesOnPost({
    required this.id,
    required this.postId,
    required this.profileId,
    this.count = 0,
  });
}
