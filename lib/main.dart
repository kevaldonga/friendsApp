import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:friendsapp/auth/screens/setprofileinfo.dart';
import 'package:friendsapp/static/colors.dart';

import 'auth/screens/loginview.dart';
import 'auth/screens/phonenoverification.dart';
import 'other/firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
  EasyLoading.instance
    ..userInteractions = false
    ..dismissOnTap = false;
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: EasyLoading.init(),
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSwatch().copyWith(
          secondary: MyColors.accentColor,
        ),
        splashColor: MyColors.splashColor,
        highlightColor: MyColors.highlightColor,
        focusColor: MyColors.focusColor,
      ),
      home: AnnotatedRegion<SystemUiOverlayStyle>(
        value: const SystemUiOverlayStyle(
          statusBarBrightness: Brightness.light,
          statusBarIconBrightness: Brightness.dark,
          statusBarColor: Colors.transparent,
        ),
        child: FirebaseAuth.instance.currentUser == null
            ? const LoginView()
            : FirebaseAuth.instance.currentUser!.phoneNumber != null
                ? const SetProfileInfo()
                : const PhoneNoVerification(),
      ),
    );
  }
}
