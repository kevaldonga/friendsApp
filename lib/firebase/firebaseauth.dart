import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
import 'package:friendsapp/auth/common/functions/handleexecptions.dart';
import 'package:google_sign_in/google_sign_in.dart';

class Auth {
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  static Future<dynamic> login(String email, String password) async {
    UserCredential user;
    try {
      user = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
    } on FirebaseAuthException catch (e) {
      return e;
    } on Exception catch (other) {
      return other;
    }
    return user;
  }

  static Future<dynamic> linkPhoneNo(
      PhoneAuthCredential phoneAuthCredential) async {
    EasyLoading.show(status: "verifying...");
    UserCredential user;
    try {
      user = await _auth.currentUser!.linkWithCredential(phoneAuthCredential);
    } on FirebaseAuthException catch (e) {
      EasyLoading.dismiss();
      return e;
    } on Exception catch (other) {
      EasyLoading.dismiss();
      return other;
    }
    EasyLoading.dismiss();
    return user;
  }

  static Future<dynamic> signUp(String email, String password) async {
    UserCredential user;
    try {
      user = await _auth.createUserWithEmailAndPassword(
          email: email, password: password);
    } on FirebaseAuthException catch (e) {
      return e;
    } on Exception catch (other) {
      return other;
    }
    return user;
  }

  static Future<dynamic> signOut() async {
    EasyLoading.show(status: "signing out...");
    await _auth.signOut();
    await GoogleSignIn().signOut();
    await FacebookAuth.instance.logOut();
    EasyLoading.dismiss();
  }

  static void passwordResetLink(String email) {
    try {
      FirebaseAuth.instance.sendPasswordResetEmail(email: email);
    } on FirebaseAuth catch (e) {
      handleExeptions(e);
    }
  }
}
