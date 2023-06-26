class MyUser {
  final int id;
  final String uid;
  final String email;
  final String phoneno;
  final String countrycode;
  final DateTime createdAt;
  DateTime updatedAt;

  MyUser({
    required this.id,
    required this.uid,
    required this.email,
    required this.phoneno,
    required this.countrycode,
    required this.createdAt,
    required this.updatedAt,
  });
}
