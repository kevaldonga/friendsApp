import 'dart:io';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:friendsapp/SystemChannels/toast.dart';
import 'package:friendsapp/auth/common/functions/validations.dart';
import 'package:friendsapp/auth/common/widgets/textfield.dart';
import 'package:friendsapp/global/functions/clickphoto.dart';
import 'package:friendsapp/global/functions/compressimage.dart';
import 'package:friendsapp/global/widgets/avatarcircle.dart';
import 'package:friendsapp/global/widgets/sharebottomsheet.dart';
import 'package:friendsapp/static/colors.dart';
import 'package:friendsapp/static/textstyles.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../global/functions/pickimage.dart';

class SetProfileInfo extends StatelessWidget {
  const SetProfileInfo({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (prcontext) => SetProfileInfoProvider(md: MediaQuery.of(context)),
      child: Consumer<SetProfileInfoProvider>(builder: (context, provider, _) {
        return Scaffold(
          resizeToAvoidBottomInset: true,
          floatingActionButtonLocation:
              FloatingActionButtonLocation.centerFloat,
          floatingActionButton: provider.disabled
              ? null
              : FloatingActionButton.extended(
                  extendedPadding: const EdgeInsets.all(30),
                  icon: Text("submit",
                      style: TextStyles.subtitleText
                          .copyWith(color: Colors.white)),
                  label: const Icon(
                    FontAwesomeIcons.arrowRight,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    submitInfo(provider);
                  },
                  backgroundColor: MyColors.accentColor,
                  isExtended: true,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25)),
                ),
          body: SafeArea(
            child: Container(
              padding: const EdgeInsets.all(20),
              height: provider.md.size.height,
              width: provider.md.size.width,
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // title
                    const Text("Set up", style: TextStyles.titleText),

                    // profile circle
                    Padding(
                      padding: EdgeInsets.symmetric(
                        vertical: provider.md.size.height * 0.07,
                      ),
                      child: avatar(provider.md,
                          editable: true,
                          url: provider.getUrl,
                          file: provider.getFile, onEditTapped: () {
                        showbottomsheet(
                          context: context,
                          items: [
                            // camera
                            shareItem(
                              context: context,
                              backgroundcolor: MyColors.secondarySwatch,
                              icon: FontAwesomeIcons.camera,
                              ontap: () {
                                Navigator.of(context).pop();
                                pickphoto(provider, ImageSource.camera);
                              },
                            ),
                            shareItem(
                              context: context,
                              backgroundcolor: MyColors.accentColorShade,
                              icon: FontAwesomeIcons.solidImage,
                              ontap: () {
                                Navigator.of(context).pop();
                                pickphoto(provider, ImageSource.gallery);
                              },
                            ),
                          ],
                        );
                      }),
                    ),

                    // form
                    ...formFields(provider, context),
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  void submitInfo(SetProfileInfoProvider provider) {}

  List<Widget> formFields(
      SetProfileInfoProvider provider, BuildContext context) {
    return [
      // username
      AuthTextField(
        focusnode: provider.usernameNode,
        maxLength: 10,
        inputType: InputType.username,
        onSubmitted: (username) {
          FocusScope.of(context).requestFocus(provider.bioNode);
        },
        onChanged: (username) {
          provider.setUsername = username;
        },
      ),

      const Padding(
        padding: EdgeInsets.only(top: 24, bottom: 8, left: 10),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Text("bio", style: TextStyles.labelText),
        ),
      ),
      // bio
      AuthTextField(
        focusnode: provider.bioNode,
        maxLength: 200,
        inputType: InputType.bio,
        onSubmitted: (username) {
          FocusScope.of(context).requestFocus(FocusNode());
          if (validateUsername(provider.getUsername)) {
            submitInfo(provider);
          } else {
            Toast("invalid username");
          }
        },
        onChanged: (username) {
          provider.setUsername = username;
        },
      ),
    ];
  }

  void pickphoto(SetProfileInfoProvider provider, ImageSource source) {
    File? myfile;
    if (source == ImageSource.gallery) {
      pickImage((file) async {
        myfile = file;
        provider.setFile = await compressImage(myfile!, 80);
      });
    } else {
      clickPhoto((file) async {
        myfile = file;
        provider.setFile = await compressImage(myfile!, 80);
      });
    }
  }
}

class SetProfileInfoProvider extends ChangeNotifier {
  MediaQueryData md;
  String? _url;
  File? _file;
  String _username = "";
  String? _bio;
  bool disabled = false;

  final FocusNode _usernameNode = FocusNode();
  final FocusNode _bioNode = FocusNode();

  SetProfileInfoProvider({required this.md});

  bool get getDisabled => disabled;

  FocusNode get usernameNode => _usernameNode;

  FocusNode get bioNode => _bioNode;

  String? get getUrl => _url;

  String? get getBio => _bio;

  File? get getFile => _file;

  String get getUsername => _username;

  set setDisabled(bool disabled) {
    disabled = disabled;
    notifyListeners();
  }

  set setFile(File file) {
    _file = file;
    notifyListeners();
  }

  set setUsername(String username) {
    _username = username;
    notifyListeners();
  }

  set setUrl(String url) {
    _url = url;
    notifyListeners();
  }

  set setBio(String bio) {
    _bio = bio;
    notifyListeners();
  }
}
