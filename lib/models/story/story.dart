class Story {
  final int id;
  final int profileId;
  String media;
  String? description;
  int likesCount;
  final DateTime createdAt;
  DateTime updatedAt;

  Story({
    required this.id,
    required this.profileId,
    required this.media,
    required this.description,
    this.likesCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });
}
