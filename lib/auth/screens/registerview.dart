import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:friendsapp/SystemChannels/toast.dart';
import 'package:friendsapp/auth/common/functions/handleexecptions.dart';
import 'package:friendsapp/auth/common/functions/validations.dart';
import 'package:friendsapp/auth/common/widgets/otherauthproviders.dart';
import 'package:friendsapp/auth/screens/loginview.dart';
import 'package:friendsapp/auth/screens/phonenoverification.dart';
import 'package:friendsapp/firebase/firebaseauth.dart';
import 'package:friendsapp/global/functions/alertdialogbox.dart';
import 'package:friendsapp/models/user/user.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:provider/provider.dart';

import '../../firebase/otherauthproviders.dart';
import '../common/widgets/button.dart';
import '../common/widgets/textfield.dart';
import 'otpverfication.dart';

class RegisterView extends StatelessWidget {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (prcontext) => RegisterViewProvider(md: MediaQuery.of(context)),
      child: Consumer<RegisterViewProvider>(builder: (context, provider, _) {
        return Scaffold(
          resizeToAvoidBottomInset: false,
          body: SafeArea(
            child: Container(
              width: provider.md.size.width,
              height: provider.md.size.height,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Stack(
                alignment: Alignment.topCenter,
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.vertical,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(height: 20),
                        // title
                        const Text("Create Account",
                            style: TextStyles.titleText),

                        // description text
                        const Text(
                          "connect with your friends today!",
                          style: TextStyles.descriptionText,
                        ),

                        SizedBox(height: provider.md.size.height * 0.02),
                        ...form(provider, context),
                        // dont have an account sign up
                      ],
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Already have an Account?",
                          style: TextStyles.descriptionText,
                        ),
                        const SizedBox(width: 7),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).pushAndRemoveUntil(
                              MaterialPageRoute(
                                  builder: (context) => const LoginView()),
                              (_) => false,
                            );
                          },
                          child: const Text(
                            "Login",
                            style: TextStyles.highlightedBoldText,
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }

  List<Widget> form(RegisterViewProvider provider, BuildContext context) {
    return [
      // email
      const Padding(
        padding: EdgeInsets.only(top: 24, bottom: 8),
        child: Text("email address", style: TextStyles.labelText),
      ),
      AuthTextField(
        focusnode: provider.emailNode,
        hintText: "enter your email",
        inputType: InputType.email,
        onChanged: (value) {
          provider.email = value;
        },
        onSubmitted: (value) {
          FocusScope.of(context).requestFocus(provider.phonenoNode);
        },
      ),

      // phoneno
      const Padding(
        padding: EdgeInsets.only(top: 24, bottom: 8),
        child: Text("contact no", style: TextStyles.labelText),
      ),
      AuthTextField(
        focusnode: provider.phonenoNode,
        maxLength: 10,
        hintText: "enter your phone no",
        inputType: InputType.phoneno,
        onChanged: (value) {
          provider.phoneno = value;
        },
        onCountryCodeChanged: (code) {
          provider.countrycode = code;
        },
        onSubmitted: (value) {
          FocusScope.of(context).requestFocus(provider.passwordNode);
        },
      ),

      // password
      const Padding(
        padding: EdgeInsets.only(top: 24, bottom: 8),
        child: Text("password", style: TextStyles.labelText),
      ),
      AuthTextField(
        focusnode: provider.passwordNode,
        hintText: "enter your password",
        inputType: InputType.password,
        onChanged: (value) {
          provider.password = value;
        },
        onSubmitted: (value) {
          FocusScope.of(context).requestFocus(FocusNode());
          if (validateEmail(provider.email) &&
              validatePassword(provider.password) &&
              validatePhoneno(provider.phoneno) &&
              provider.email.isNotEmpty) {
            onPressedSignUp(provider, context);
          } else {
            Toast("resolve all errors before proceeding!");
          }
        },
      ),

      // login button
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 50),
        child: Center(
          child: AuthButton(
            disabled: (!(validateEmail(provider.email) &&
                    validatePassword(provider.password) &&
                    validatePhoneno(provider.phoneno))) ||
                provider.email.isEmpty,
            onPressed: () {
              onPressedSignUp(provider, context);
            },
            text: "sign up",
          ),
        ),
      ),

      Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Expanded(
              child: Container(
                color: const Color.fromARGB(255, 204, 192, 192),
                height: 1,
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 15),
              child: Text("or sign up with", style: TextStyles.labelText),
            ),
            Expanded(
              child: Container(
                color: const Color.fromARGB(255, 204, 192, 192),
                height: 1,
              ),
            ),
          ],
        ),
      ),

      otherproviders(context),
    ];
  }

  Row otherproviders(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        // goole
        AuthProviderButton(
          text: "google",
          onPressed: () async {
            OtherAuthProviders.signIn(options: Options.google).then((result) {
              if (result.runtimeType == User) {
                Toast("signed in successfully !!");
                Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(
                        builder: (context) => const PhoneNoVerification()),
                    (_) => false);
              }
            });
            // other provider will return user instead of usercredentials
          },
          iconPath: "lib/Assets/Icons/google.png",
        ),

        // facebook
        AuthProviderButton(
          text: "facebook",
          onPressed: () async {
            OtherAuthProviders.signIn(options: Options.facebook).then((result) {
              if (result.runtimeType == User) {
                Toast("signed in successfully !!");
                Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(
                        builder: (context) => const PhoneNoVerification()),
                    (_) => false);
              }
            });
          },
          iconPath: "lib/Assets/Icons/facebook.png",
        ),
      ],
    );
  }

  void register(RegisterViewProvider provider, BuildContext context) async {
    Toast("your account has been registered successfully!");
    await showBasicDialog(
      context,
      "OTP verification",
      "OTP will be sent to your phone no- ${provider.countrycode}${provider.phoneno}",
    ).whenComplete(() {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (context) => OtpVerification(
            user: MyUser(
              id: 1,
              uid: "1",
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
              email: provider.email,
              phoneno: provider.phoneno,
              countrycode: provider.countrycode,
            ),
          ),
        ),
        (_) => false,
      );
    });
  }

  void onPressedSignUp(
      RegisterViewProvider provider, BuildContext context) async {
    EasyLoading.show(status: "signing up...");
    await Auth.signUp(provider.email, provider.password).then((result) {
      EasyLoading.dismiss();
      if (result.runtimeType == UserCredential) {
        register(provider, context);
        return;
      }
      handleExeptions(result);
    });
  }
}

class RegisterViewProvider extends ChangeNotifier {
  MediaQueryData _md;
  String _email = "";
  final FocusNode _emailNode = FocusNode();
  String _phoneno = "";
  final FocusNode _phonenoNode = FocusNode();
  String _password = "";
  final FocusNode _passwordNode = FocusNode();
  String _countrycode = "+91";

  RegisterViewProvider({required MediaQueryData md}) : _md = md;

  String get email => _email;

  FocusNode get emailNode => _emailNode;

  String get phoneno => _phoneno;

  FocusNode get phonenoNode => _phonenoNode;

  String get password => _password;

  FocusNode get passwordNode => _passwordNode;

  String get countrycode => _countrycode;

  MediaQueryData get md => _md;

  set email(String email) {
    _email = email;
    notifyListeners();
  }

  set password(String password) {
    _password = password;
    notifyListeners();
  }

  set phoneno(String phoneno) {
    _phoneno = phoneno;
    notifyListeners();
  }

  set countrycode(String countrycode) {
    _countrycode = countrycode;
    notifyListeners();
  }

  set md(MediaQueryData md) {
    _md = md;
    notifyListeners();
  }
}
