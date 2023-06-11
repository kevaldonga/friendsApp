class Post {
  final int id;
  final int profileId;
  String title;
  String? description;
  String mediaUrl;
  final DateTime createdAt;
  DateTime lastModified;

  Post({
    required this.id,
    required this.profileId,
    required this.title,
    required this.mediaUrl,
    required this.createdAt,
    required this.lastModified,
    this.description,
  });
}
