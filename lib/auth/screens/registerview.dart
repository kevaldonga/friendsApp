import 'package:flutter/material.dart';
import 'package:friendsapp/auth/common/widgets/otherauthproviders.dart';
import 'package:friendsapp/auth/screens/loginview.dart';
import 'package:friendsapp/auth/screens/otpverfication.dart';
import 'package:friendsapp/models/user.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:provider/provider.dart';

import '../common/widgets/button.dart';
import '../common/widgets/textfield.dart';

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
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                  builder: (context) => const LoginView()),
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
        },
      ),

      // login button
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 50),
        child: Center(
          child: AuthButton(
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => OtpVerfication(
                      user: User(
                          email: provider.email,
                          phoneno: provider.phoneno,
                          countrycode: provider.countrycode))));
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

      otherproviders(),
    ];
  }

  Row otherproviders() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: const [
        // goole
        AuthProviderButton(
          text: "google",
          onPressed: null,
          iconPath: "lib/Assets/Icons/google.png",
        ),

        // facebook
        AuthProviderButton(
          text: "facebook",
          onPressed: null,
          iconPath: "lib/Assets/Icons/facebook.png",
        ),
      ],
    );
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
  String _countrycode = "";

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
