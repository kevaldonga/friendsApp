import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../SystemChannels/toast.dart';

class OtherAuthProviders {
  static Future<dynamic> signIn({required Options options}) async {
    switch (options) {
      case Options.google:
        return await _googleSignIn();
      case Options.facebook:
        return await _facebookSignIn();
    }
  }

  static Future<dynamic> _googleSignIn() async {
    final GoogleSignInAccount? googleSignInAccount =
        await GoogleSignIn().signIn();
    User? user;
    if (googleSignInAccount != null) {
      final GoogleSignInAuthentication googleSignInAuthentication =
          await googleSignInAccount.authentication;
      AuthCredential credential = GoogleAuthProvider.credential(
        idToken: googleSignInAuthentication.idToken,
        accessToken: googleSignInAuthentication.accessToken,
      );
      try {
        var result =
            await FirebaseAuth.instance.signInWithCredential(credential);
        user = result.user;
      } on FirebaseAuthException catch (e) {
        return e;
      }
      return user;
    }
  }

  static Future<dynamic> _facebookSignIn() async {
    final LoginResult result = await FacebookAuth.instance.login();

    if (result.status == LoginStatus.success) {
      final String accessToken = result.accessToken!.token;

      final OAuthCredential credential =
          FacebookAuthProvider.credential(accessToken);

      final UserCredential userCredential;
      try {
        userCredential =
            await FirebaseAuth.instance.signInWithCredential(credential);
      } on FirebaseAuthException catch (e) {
        return e;
      }

      final User? user = userCredential.user;
      if (user != null) {
        return user;
      } else {
        Toast("failed to sign in !!");
        return null;
      }
    }
    return null;
  }
}

enum Options {
  google,
  facebook,
}
