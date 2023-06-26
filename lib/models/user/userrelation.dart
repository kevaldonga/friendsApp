class UserRelation {
  final int id;
  final int followerProfileId;
  final int beingFollowedProfileId;
  final DateTime createdAt;
  DateTime updatedAt;

  UserRelation({
    required this.id,
    required this.beingFollowedProfileId,
    required this.followerProfileId,
    required this.createdAt,
    required this.updatedAt,
  });
}
