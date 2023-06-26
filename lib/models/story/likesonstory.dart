class LikesOnStory {
  final int id;
  final int storyId;
  final int profileId;
  int count;

  LikesOnStory({
    required this.id,
    required this.storyId,
    required this.profileId,
    this.count = 0,
  });
}
