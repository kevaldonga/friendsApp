class Profile {
  final int id;
  final int userId;
  String username;
  String bio;
  bool isActive;
  String? note;
  String? avatarUrl;
  final DateTime createdAt;
  DateTime updatedAt;

  Profile({
    required this.id,
    required this.userId,
    required this.username,
    required this.bio,
    required this.createdAt,
    required this.updatedAt,
    this.note,
    this.avatarUrl,
    this.isActive = false,
  });
}
