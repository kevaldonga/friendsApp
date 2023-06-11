import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:friendsapp/SystemChannels/toast.dart';
import 'package:friendsapp/auth/common/functions/handleexecptions.dart';
import 'package:friendsapp/auth/common/functions/validations.dart';
import 'package:friendsapp/auth/common/widgets/textfield.dart';
import 'package:friendsapp/firebase/firebaseauth.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:friendsapp/userside/screens/userview.dart';
import 'package:provider/provider.dart';

import '../../firebase/exceptions/verification.dart';
import '../../models/user/user.dart';
import '../common/widgets/button.dart';

class OtpVerification extends StatelessWidget {
  final MyUser user;
  const OtpVerification({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (prcontext) =>
          OtpVerificationProvider(md: MediaQuery.of(context)),
      child: Consumer<OtpVerificationProvider>(builder: (context, provider, _) {
        if (provider.firstTime) {
          provider.firstTime = false;
          verify(provider, context);
        }
        return Scaffold(
          resizeToAvoidBottomInset: false,
          body: SafeArea(
            child: Container(
              width: provider.md.size.width,
              height: provider.md.size.height,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(height: 20),
                    // title with backbutton
                    const Text("Verification", style: TextStyles.titleText),

                    SizedBox(height: provider.md.size.height * 0.02),
                    ...otpTiles(provider, context),
                    // dont have an account sign up
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  List<Widget> otpTiles(
      OtpVerificationProvider provider, BuildContext context) {
    return [
      // code has been sent text
      Padding(
        padding: const EdgeInsets.only(top: 24, bottom: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text("code has been sent to", style: TextStyles.labelText),
            Text("${user.countrycode}${user.phoneno}",
                style: TextStyles.highlightedBoldText),
          ],
        ),
      ),
      Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(
          provider.otp.length,
          (index) => AuthTextField(
            focusnode: provider.focusnodes[index],
            inputType: InputType.otp,
            maxLength: 1,
            onChanged: (value) {
              provider.setotp(index, value);
              if (value.isEmpty) {
                if (index == 0) {
                  return;
                }
                FocusScope.of(context)
                    .requestFocus(provider.focusnodes[index - 1]);
              } else {
                if (index == provider.otp.length - 1) {
                  FocusScope.of(context).requestFocus(FocusNode());
                  return;
                }
                FocusScope.of(context)
                    .requestFocus(provider.focusnodes[index + 1]);
              }
            },
            onSubmitted: (value) {
              if (index == provider.otp.length - 1) {
                FocusScope.of(context).requestFocus(FocusNode());
                return;
              }
              FocusScope.of(context)
                  .requestFocus(provider.focusnodes[index + 1]);
            },
          ),
        ),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            "Haven't received code?",
            style: TextStyles.descriptionText,
          ),
          const SizedBox(width: 7),
          GestureDetector(
            onTap: () {
              verify(provider, context);
            },
            child: const Text(
              "Resend",
              style: TextStyles.highlightedBoldText,
            ),
          ),
        ],
      ),
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 50),
        child: Center(
          child: AuthButton(
            disabled: !validate(provider),
            onPressed: () async {
              // dont have to check for validations cause if it is not validated
              // button would not be clickable
              PhoneAuthCredential credential = PhoneAuthProvider.credential(
                  verificationId: provider.verificationId,
                  smsCode: provider.otp.join(""));
              dynamic result = await Auth.linkPhoneNo(credential);
              if (result.runtimeType == UserCredential) {
                Toast("you have been verified");
                return;
              }
              handleExeptions(result);
            },
            text: "verify",
          ),
        ),
      ),
    ];
  }

  void onbackpressed(BuildContext context) {
    Navigator.of(context).pop();
  }

  bool validate(OtpVerificationProvider provider) {
    for (int i = 0; i < provider.otp.length; i++) {
      if (provider.otp[i] == null || provider.otp[i] == "") return false;
      if (!validateOtp(provider.otp[i]!)) {
        return false;
      }
    }
    return true;
  }

  void verify(OtpVerificationProvider provider, BuildContext context) {
    Verification.verify(
      phoneno: "${user.countrycode}${user.phoneno}",
      codeSent: (verificationId, forceResendingToken) {
        provider.verificationId = verificationId;
        provider.forceResendingToken = forceResendingToken;
        Toast("code has been sent");
      },
      forceResendingToken: provider.forceResendingToken,
      codeAutoRetrievalTimeout: (verificationId) {},
      verificationCompleted: (phoneAuthCredential) async {
        if (phoneAuthCredential.smsCode == null) {
          return;
        }
        // set the sms code
        for (int i = 0; i < provider.otp.length; i++) {
          provider.otp[i] = phoneAuthCredential.smsCode![i];
        }

        await Auth.linkPhoneNo(phoneAuthCredential).then((result) {
          if (result.runtimeType == UserCredential) {
            Toast("you have been verified !!");
            Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => const UserView()),
                (route) => false);
            return;
          }
          handleExeptions(result);
        });
      },
    );
  }
}

class OtpVerificationProvider extends ChangeNotifier {
  bool firstTime = true;
  String _verificationId = "";
  int? _forceResendingToken;
  MediaQueryData _md;
  final List<String> _otp = ["", "", "", "", "", ""];
  final List<FocusNode> _focusnodes = [
    FocusNode(),
    FocusNode(),
    FocusNode(),
    FocusNode(),
    FocusNode(),
    FocusNode(),
  ];

  OtpVerificationProvider({required MediaQueryData md}) : _md = md;

  MediaQueryData get md => _md;

  List<String?> get otp => _otp;

  List<FocusNode> get focusnodes => _focusnodes;

  String get verificationId => _verificationId;

  int? get forceResendingToken => _forceResendingToken;

  set verificationId(String verificationId) {
    _verificationId = verificationId;
    notifyListeners();
  }

  set forceResendingToken(int? forceResendingToken) {
    _forceResendingToken = forceResendingToken;
    notifyListeners();
  }

  set md(MediaQueryData md) {
    _md = md;
    notifyListeners();
  }

  void setotp(int index, String otp) {
    _otp[index] = otp;
    notifyListeners();
  }
}
