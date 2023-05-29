import 'package:firebase_auth/firebase_auth.dart';
import 'package:friendsapp/auth/common/functions/handleexecptions.dart';

class Verification {
  static final _auth = FirebaseAuth.instance;
  static Future<void> verify({
    required String phoneno,
    required void Function(
      String verificationId,
      int? forceResendingToken,
    )
        codeSent,
    required void Function(String verificationId) codeAutoRetrievalTimeout,
    required void Function(PhoneAuthCredential phoneAuthCredential)
        verificationCompleted,
    int? forceResendingToken,
  }) async {
    await _auth.verifyPhoneNumber(
      forceResendingToken: forceResendingToken,
      timeout: const Duration(seconds: 30),
      phoneNumber: phoneno,
      verificationCompleted: verificationCompleted,
      verificationFailed: (error) {
        handleExeptions(error);
      },
      codeSent: codeSent,
      codeAutoRetrievalTimeout: codeAutoRetrievalTimeout,
    );
  }
}
