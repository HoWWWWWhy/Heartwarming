package com.heartwarming;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;

public class DocumentCreatorModule extends ReactContextBaseJavaModule {

    private static final String NAME = "RNDocumentCreator";

    public static final int REQUEST_CODE = 100;

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "ACTIVITY_DOES_NOT_EXIST";

    private Promise promise;

    DocumentCreatorModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void createDocument(String fileName, String type, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        String documentMimeType = "*/*";
        String jsonMimeType = "json";
        String fullFileName = fileName;
        if (currentActivity == null) {
            sendError(E_ACTIVITY_DOES_NOT_EXIST, "Current activity does not exist");
            return;
        }
        //Toast.makeText(this, "Saved!", Toast.LENGTH_SHORT).show();
        Log.d("react-native", fileName);

        try {
            if (type.equals(jsonMimeType)) {
                documentMimeType = "application/octet-stream";
                fullFileName = fileName + ".json";
            }

            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType(documentMimeType);
            intent.putExtra(Intent.EXTRA_TITLE, fullFileName);

            //mCreateDocument.launch(intent);
            currentActivity.startActivityForResult(intent, REQUEST_CODE);
        } catch (Exception e) {
            //Log.d("error", e.toString());
        }
    }


    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (promise == null) {
                return;
            }
            if (requestCode == REQUEST_CODE) {
                onCreateActivityResult(resultCode, data, promise);
            }
        }
    };

    protected void onCreateActivityResult(int resultCode, Intent data, Promise promise) {
        if (resultCode == REQUEST_CODE) {
            if (resultCode != Activity.RESULT_OK) {
                Log.d("react-native", "onCreateActivityResult");
                return;
            }

        }
    }

    private void sendError(String code, String message) {
        sendError(code, message, null);
    }

    private void sendError(String code, String message, Exception e) {
        if (this.promise != null) {
            Promise temp = this.promise;
            this.promise = null;
            temp.reject(code, message, e);
        }
    }
}