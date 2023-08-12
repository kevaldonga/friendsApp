import 'package:shared_preferences/shared_preferences.dart';

Future<String?> fetchToken() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();

  String? token = prefs.getString("jwt");

  return token;
}
