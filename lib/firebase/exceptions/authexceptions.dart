import 'package:firebase_auth/firebase_auth.dart';
import 'package:friendsapp/SystemChannels/toast.dart';

class MyExceptions {
  static void auth(FirebaseAuthException e) {
    switch (e.code) {
      case "invalid-email":
        Toast("given email is invalid!");
        break;
      case "user-disabled":
        Toast("this user have been disabled!");
        break;
      case "user-not-found":
        Toast("user doesn't exist!");
        break;
      case "wrong-password":
        Toast("wrong password try again!");
        break;
      case "email-already-in-use":
        Toast("email is already is use!");
        break;
      case "operation-not-allowed":
        Toast("operation is not allowed");
        break;
      case "weak-password":
        Toast("password is weak, choose a stronger password!");
        break;
    }
  }
}
