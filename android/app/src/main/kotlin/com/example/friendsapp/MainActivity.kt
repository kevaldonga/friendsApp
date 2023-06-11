package com.example.friendsapp

import android.content.Intent
import android.provider.MediaStore
import android.widget.Toast
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {

    lateinit var picker:channelFilePicker;
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        toastChannel()

        filePickerSignalReceiver()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == channelFilePicker.REQUEST_CODE_SINGLE && resultCode == RESULT_OK) {
            val fileUri = data?.data
            fileUri?.path ?: return
            var uriutils = UriUtils()
            picker.listener.invoke(uriutils.getPath(fileUri, context)!!)
        }
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

    private fun filePickerSignalReceiver() {
        MethodChannel(flutterEngine!!.dartExecutor.binaryMessenger, channelFilePicker.CHANNEL)
            .setMethodCallHandler { call, result ->
                if (call.method == "filepicker") {
                    picker = channelFilePicker()
                    picker.pickFiles(result,call,context) { intent ->
                        super.startActivityForResult(
                            intent,
                            channelFilePicker.REQUEST_CODE_SINGLE)
                    }
                } else if (call.method == "imagepicker") {
                    picker = channelFilePicker()
                    picker.pickImage(result,call,context) {
                        intent -> super.startActivityForResult(
                        intent,
                        channelFilePicker.REQUEST_CODE_SINGLE)
                    }
                }
            }
    }
}
