import 'dart:convert';

import 'package:friendsapp/constants/localhost.dart';
import 'package:http/http.dart';

class MyUser {
  final int id;
  final String uid;
  final String email;
  final String phoneno;
  final String countryCode;
  final DateTime createdAt;
  DateTime updatedAt;

  MyUser({
    required this.id,
    required this.uid,
    required this.email,
    required this.phoneno,
    required this.countryCode,
    required this.createdAt,
    required this.updatedAt,
  });

  MyUser.fromMap(Map<String, dynamic> data)
      : id = int.parse(data["id"]),
        uid = data["uid"],
        email = data["email"],
        phoneno = data["phoneno"],
        countryCode = data["countrycode"],
        createdAt = DateTime.parse(data["createdAt"]),
        updatedAt = DateTime.parse(data["updatedAt"]);

  /* 
  * /:uid - GET - get a user by uid
  */
  static Future<MyUser?> getUser({required String uid}) async {
    final Uri uri = Uri.https(localhost, "/users/$uid");
    Response response = await get(uri, headers: {"uid": uid});
    final map = jsonDecode(response.body) as Map<String, dynamic>;
    return MyUser.fromMap(map);
  }

  /* 
  * / - POST - create a user
  */
  static void createUser({required Map<String, dynamic> body}) async {
    final Uri uri = Uri.https(localhost, "/users/");
    await post(uri, body: body);
  }

  /* 
  * /:uid - PUT - update a auser
  */
  static void updateUser({
    required Map<String, dynamic> body,
    required String uid,
  }) async {
    final Uri uri = Uri.https(localhost, "/users/$uid");
    await put(uri, body: body);
  }

  /* 
  * /:uid - DELETE - delete a user
  */
  static void deleteUser({required String uid}) async {
    final Uri uri = Uri.https(localhost, "/users/$uid");
    await delete(uri);
  }
}
