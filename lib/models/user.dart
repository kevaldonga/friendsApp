import 'dart:convert';

import 'package:friendsapp/constants/localhost.dart';
import 'package:friendsapp/models/common/exeptions/jwttokenexeption.dart';
import 'package:friendsapp/models/common/functions/jwttoken.dart';
import 'package:http/http.dart';

import '../constants/jwtheader.dart';

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

  static String? token;

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
    Response response = await get(uri);
    final map = jsonDecode(response.body) as Map<String, dynamic>;
    return MyUser.fromMap(map);
  }

  /* 
  * / - POST - create a user
  */
  static void createUser({required Map<String, dynamic> body}) async {
    final Uri uri = Uri.https(localhost, "/users/");
    await post(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:uid - PUT - update a user
  */
  static void updateUser({
    required Map<String, dynamic> body,
    required String uid,
  }) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/users/$uid");
    await put(uri, body: body, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }

  /* 
  * /:uid - DELETE - delete a user
  */
  static void deleteUser({required String uid}) async {
    token ??= await fetchToken();
    if (token == null) throw JwtTokenExeption("user is not logged in!!");

    final Uri uri = Uri.https(localhost, "/users/$uid");
    await delete(uri, headers: {
      ...header,
      "Authorization": "Bearer $token",
    });
  }
}
