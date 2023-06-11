import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../SystemChannels/toast.dart';
import '../../global/functions/alertdialogbox.dart';
import '../../models/user/user.dart';
import '../../static/textstyles.dart';
import '../common/functions/validations.dart';
import '../common/widgets/button.dart';
import '../common/widgets/textfield.dart';
import 'otpverfication.dart';

class PhoneNoVerification extends StatelessWidget {
  const PhoneNoVerification({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (prcontext) =>
          PhoneNoVerificationProvider(md: MediaQuery.of(context)),
      child: Consumer<PhoneNoVerificationProvider>(
          builder: (context, provider, _) {
        return Scaffold(
          resizeToAvoidBottomInset: false,
          body: SafeArea(
            child: Container(
              width: provider.md.size.width,
              height: provider.md.size.height,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(height: 20),
                    const Text(
                      "Verify your phoneno",
                      style: TextStyles.titleText,
                    ),
                    SizedBox(height: provider.md.size.height * 0.1),
                    AuthTextField(
                      focusnode: FocusNode(),
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
                        if (validatePhoneno(provider.phoneno)) {
                          operation(provider, context);
                        } else {
                          Toast("resolve all errors before proceeding!");
                        }
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 50),
                      child: Center(
                        child: AuthButton(
                          disabled: !validatePhoneno(provider.phoneno),
                          onPressed: () {
                            operation(provider, context);
                          },
                          text: "confirm",
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  void operation(
      PhoneNoVerificationProvider provider, BuildContext context) async {
    await showBasicDialog(
      context,
      "OTP verification",
      "OTP will be sent to your phone no- ${provider.countrycode}${provider.phoneno}",
    ).whenComplete(() {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(
          builder: (context) => OtpVerification(
            user: MyUser(
              email: "",
              phoneno: provider.phoneno,
              countrycode: provider.countrycode,
            ),
          ),
        ),
        (_) => false,
      );
    });
  }
}

class PhoneNoVerificationProvider extends ChangeNotifier {
  MediaQueryData _md;
  String _phoneno = "";
  String _countrycode = "+91";

  PhoneNoVerificationProvider({required MediaQueryData md}) : _md = md;

  String get countrycode => _countrycode;

  String get phoneno => _phoneno;

  MediaQueryData get md => _md;

  set phoneno(String phoneno) {
    _phoneno = phoneno;
    notifyListeners();
  }

  set md(MediaQueryData md) {
    _md = md;
    notifyListeners();
  }

  set countrycode(String countrycode) {
    _countrycode = countrycode;
    notifyListeners();
  }
}
