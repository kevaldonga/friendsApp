import 'package:flutter/material.dart';
import 'package:friendsapp/auth/common/widgets/textfield.dart';
import 'package:friendsapp/static/colors.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:provider/provider.dart';

import '../../models/user.dart';
import '../common/widgets/button.dart';

class OtpVerfication extends StatelessWidget {
  final User user;
  const OtpVerfication({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (prcontext) => OtpVerficationProvider(md: MediaQuery.of(context)),
      child: Consumer<OtpVerficationProvider>(builder: (context, provider, _) {
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
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        // backbutton
                        IconButton(
                          onPressed: () {
                            onbackpressed(context);
                          },
                          icon: const Icon(Icons.keyboard_arrow_left_rounded,
                              color: MyColors.accentColor),
                        ),
                        const Text("Verification", style: TextStyles.titleText),
                      ],
                    ),

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

  List<Widget> otpTiles(OtpVerficationProvider provider, BuildContext context) {
    return [
      // code has been sent text
      Padding(
        padding: const EdgeInsets.only(top: 24, bottom: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text("code has been sent to", style: TextStyles.labelText),
            Text("${user.countrycode}${user.phoneno} &",
                style: TextStyles.highlightedBoldText),
            Text(user.email, style: TextStyles.highlightedBoldText),
          ],
        ),
      ),
      Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(
          4,
          (index) => AuthTextField(
            focusnode: provider.focusnodes[index],
            inputType: InputType.otp,
            maxLength: 1,
            onChanged: (value) {
              provider.setotp(index, value.isEmpty ? null : value);
              if (value.isEmpty) {
                if (index == 0) {
                  return;
                }
                FocusScope.of(context)
                    .requestFocus(provider.focusnodes[index - 1]);
              } else {
                if (index == 3) {
                  FocusScope.of(context).requestFocus(FocusNode());
                  return;
                }
                FocusScope.of(context)
                    .requestFocus(provider.focusnodes[index + 1]);
              }
            },
            onSubmitted: (value) {
              if (index == 3) {
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
            onTap: () {},
            child: const Text(
              "Resend",
              style: TextStyles.highlightedBoldText,
            ),
          ),
        ],
      ),
      const Padding(
        padding: EdgeInsets.symmetric(vertical: 50),
        child: Center(
          child: AuthButton(
            onPressed: null,
            text: "verify",
          ),
        ),
      ),
    ];
  }

  void onbackpressed(BuildContext context) {
    Navigator.of(context).pop();
  }
}

class OtpVerficationProvider extends ChangeNotifier {
  MediaQueryData _md;
  final List<String?> _otp = [null, null, null, null];
  final List<FocusNode> _focusnodes = [
    FocusNode(),
    FocusNode(),
    FocusNode(),
    FocusNode(),
  ];

  OtpVerficationProvider({required MediaQueryData md}) : _md = md;

  MediaQueryData get md => _md;

  List<String?> get otp => _otp;

  List<FocusNode> get focusnodes => _focusnodes;

  set md(MediaQueryData md) {
    _md = md;
    notifyListeners();
  }

  void setotp(int index, String? otp) {
    _otp[index] = otp;
    notifyListeners();
  }
}
