class HashtagsOnProfile {
  final int id;
  final int profileId;
  final int hashtagId;
  final DateTime createdAt;
  DateTime updatedAt;

  HashtagsOnProfile({
    required this.id,
    required this.profileId,
    required this.hashtagId,
    required this.createdAt,
    required this.updatedAt,
  });
}
