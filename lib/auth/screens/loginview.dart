import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:friendsapp/SystemChannels/toast.dart';
import 'package:friendsapp/auth/common/functions/validations.dart';
import 'package:friendsapp/auth/common/widgets/otherauthproviders.dart';
import 'package:friendsapp/auth/screens/phonenoverification.dart';
import 'package:friendsapp/auth/screens/registerview.dart';
import 'package:friendsapp/firebase/firebaseauth.dart';
import 'package:friendsapp/firebase/otherauthproviders.dart';
import 'package:friendsapp/global/functions/alertdialogbox.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:friendsapp/userside/screens/userview.dart';
import 'package:provider/provider.dart';

import '../common/functions/handleexecptions.dart';
import '../common/widgets/button.dart';
import '../common/widgets/textfield.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (prcontext) => LoginViewProvider(md: MediaQuery.of(context)),
      child: Consumer<LoginViewProvider>(builder: (context, provider, _) {
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
                        const Text("Hi, Welcome back !",
                            style: TextStyles.titleText),

                        // description text
                        const Text(
                          "hello again, you've been missed!",
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
                          "Don't have an account?",
                          style: TextStyles.descriptionText,
                        ),
                        const SizedBox(width: 7),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).pushAndRemoveUntil(
                              MaterialPageRoute(
                                  builder: (context) => const RegisterView()),
                              (_) => false,
                            );
                          },
                          child: const Text(
                            "Sign Up",
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

  List<Widget> form(LoginViewProvider provider, BuildContext context) {
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
              provider.email.isNotEmpty) {
            onPressedLogin(provider, context);
          } else {
            Toast("resolve all errors before proceeding!");
          }
        },
      ),
      GestureDetector(
        onTap: () async {
          if (validateEmail(provider.email) && provider.email.isNotEmpty) {
            await showBasicDialog(context, "password reset link",
                    "Password reset link will be sent to your email address.",
                    buttonText: "SEND")
                .whenComplete(
              () {
                Auth.passwordResetLink(provider.email);
                Toast("password reset link has been sent to your email");
              },
            );
          } else {
            Toast("invalid email address");
          }
        },
        child: const Text("forgot password?",
            style: TextStyles.highlightedBoldText),
      ),

      // login button
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 50),
        child: Center(
          child: AuthButton(
            disabled: (!(validateEmail(provider.email) &&
                    validatePassword(provider.password))) ||
                provider.email.isEmpty,
            onPressed: () {
              onPressedLogin(provider, context);
            },
            text: "login",
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
              child: Text("or login with", style: TextStyles.labelText),
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

  void login(BuildContext context) {
    Toast("logged in successfully!");
    Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const UserView()),
        (_) => false);
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

  void onPressedLogin(LoginViewProvider provider, BuildContext context) async {
    EasyLoading.show(status: "signing...");
    await Auth.login(provider.email, provider.password).then((result) {
      EasyLoading.dismiss();
      if (result.runtimeType == UserCredential) {
        login(context);
        return;
      }
      handleExeptions(result);
    });
  }
}

class LoginViewProvider extends ChangeNotifier {
  MediaQueryData _md;
  String _email = "";
  final FocusNode _emailNode = FocusNode();
  String _password = "";
  final FocusNode _passwordNode = FocusNode();

  LoginViewProvider({required MediaQueryData md}) : _md = md;

  String get email => _email;

  FocusNode get emailNode => _emailNode;

  String get password => _password;

  FocusNode get passwordNode => _passwordNode;

  MediaQueryData get md => _md;

  set email(String email) {
    _email = email;
    notifyListeners();
  }

  set password(String password) {
    _password = password;
    notifyListeners();
  }

  set md(MediaQueryData md) {
    _md = md;
    notifyListeners();
  }
}
