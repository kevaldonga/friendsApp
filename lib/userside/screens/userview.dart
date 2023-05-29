import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:friendsapp/auth/screens/loginview.dart';
import 'package:friendsapp/firebase/firebaseauth.dart';

class UserView extends StatelessWidget {
  const UserView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(onPressed: () async {
        await Auth.signOut().whenComplete(() {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(
              builder: (context) => const LoginView(),
            ),
            (_) => false,
          );
        });
      }),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              const Text("userview"),
              Text(FirebaseAuth.instance.currentUser!.phoneNumber.toString()),
            ],
          ),
        ),
      ),
    );
  }
}
