class Hashtag {
  final int id;
  final String tag;
  String description;
  String color;
  String image;
  final DateTime createdAt;
  DateTime updatedAt;

  Hashtag({
    required this.id,
    required this.tag,
    required this.description,
    required this.color,
    required this.image,
    required this.createdAt,
    required this.updatedAt,
  });
}
