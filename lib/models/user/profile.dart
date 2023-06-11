class Profile {
  // final int id;
  String name;
  String bio;
  String? avatarUrl;
  int likeCount;
  int commentCount;

  Profile({
    // required this.id,
    required this.name,
    required this.bio,
    this.avatarUrl,
    this.likeCount = 0,
    this.commentCount = 0,
  });
}
