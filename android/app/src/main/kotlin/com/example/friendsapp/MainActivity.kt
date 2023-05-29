package com.example.friendsapp

import android.widget.Toast
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        toastChannel()
    }

    private fun toastChannel() {
        MethodChannel(flutterEngine!!.dartExecutor.binaryMessenger, MyToast.CHANNEL)
                .setMethodCallHandler { call, _ ->
                    if (call.method == MyToast.METHOD_TOAST) {
                        val message = call.argument<String>(MyToast.KEY_MESSAGE)
                        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
                    }
                }
    }
}
