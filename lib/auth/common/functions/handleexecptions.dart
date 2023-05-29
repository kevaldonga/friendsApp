import 'package:firebase_auth/firebase_auth.dart';
import 'package:friendsapp/SystemChannels/toast.dart';
import 'package:friendsapp/firebase/exceptions/authexceptions.dart';

void handleExeptions(dynamic e) {
  if (e.runtimeType == FirebaseAuthException) {
    MyExceptions.auth(e);
    return;
  }
  // if it is not auth exeption then it would be other
  Toast("error occured!");
}
