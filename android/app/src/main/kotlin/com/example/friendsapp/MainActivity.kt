package com.example.friendsapp

import android.widget.Toast
import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        toastChannel()
    }

    private fun toastChannel() {
        MethodChannel(flutterEngine!!.dartExecutor.binaryMessenger, toast.CHANNEL)
                .setMethodCallHandler { call, _ ->
                    if (call.method == toast.METHOD_TOAST) {
                        val message = call.argument<String>(toast.KEY_MESSAGE)
                        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
                    }
                }
    }
}
