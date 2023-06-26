class Post {
  final int id;
  final int profileId;
  String title;
  String? description;
  String media;
  int likesCount;
  int commentsCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Post({
    required this.id,
    required this.profileId,
    required this.title,
    required this.media,
    required this.createdAt,
    required this.updatedAt,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.description,
  });
}
