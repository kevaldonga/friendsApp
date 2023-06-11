package com.example.friendsapp

import android.content.Context
import android.content.Intent
import android.provider.MediaStore
import android.widget.Toast
import io.flutter.embedding.android.FlutterActivity
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

class channelFilePicker {

    lateinit var listener: (String) -> Unit

    companion object{
        const val CHANNEL = "flutter.io/picker"
        const val REQUEST_CODE_SINGLE = 202 // code for single file pick
    }

    fun pickFiles(result: MethodChannel.Result,call:MethodCall,context: Context,activityCall:(intent:Intent) -> Unit){
        // pick single file
        val intent = Intent(Intent.ACTION_PICK)
        val multiple:Boolean = call.argument<Boolean>("multiple") == true
        intent.type = "*/*"
        // set type to following to accept all kids of files
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, multiple)
        listener = { path -> result.success(path) }
        if (intent.resolveActivity(context.packageManager) != null) {
            activityCall(intent)
        }
    }

    fun pickImage(result: MethodChannel.Result,call:MethodCall,context: Context,activityCall:(intent:Intent) -> Unit){
        // pick single image
        val intent =
            Intent(
                Intent.ACTION_PICK,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI
            )
        val multiple:Boolean = call.argument<Boolean>("multiple") == true
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, multiple)
        if (intent.resolveActivity(context.packageManager) != null) {
            listener = { path -> result.success(path) }
            activityCall(intent)
        } else {
            Toast.makeText(
                context,
                "you don't have gallery installed !",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    fun handleFiles(requestCode: Int, resultCode: Int, data: Intent?,context:Context){
        if (requestCode == channelFilePicker.REQUEST_CODE_SINGLE && resultCode == FlutterActivity.RESULT_OK) {
            val fileUri = data?.data
            fileUri?.path ?: return
            var uriutils = UriUtils()
            listener.invoke(uriutils.getPath(fileUri, context)!!)
        }
    }

}