package com.heartwarming;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

import android.content.ActivityNotFoundException;

import org.w3c.dom.CDATASection;


public class DocumentCreatorModule extends ReactContextBaseJavaModule {

    private static final String NAME = "RNDocumentCreator";

    public static final int REQUEST_CODE = 100;

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "ACTIVITY_DOES_NOT_EXIST";
    private static final String E_CREATE_DOCUMENT_CANCELED = "CREATE_DOCUMENT_CANCELED";
    private static final String E_UNKNOWN_ACTIVITY_RESULT = "UNKNOWN_ACTIVITY_RESULT";
    private static final String E_WRITE_DOCUMENT_ERROR = "WRITE_DOCUMENT_ERROR";
    private static final String E_NO_URI_FOUND = "NO_URI_FOUND";

    private static final int SUCCESS = 0;
    private static final int FAILURE = 1;

    private Promise mPromise;
    private FileOutputStream fileOutputStream;

    protected String DocumentData = null;

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (mPromise != null) {
                if (requestCode == REQUEST_CODE) {
                    Log.d("react-native", "Call onCreateActivityResult");
                    onCreateActivityResult(resultCode, intent, mPromise);
                }
                mPromise = null;
            }
        }
    };

    DocumentCreatorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void createDocument(String fileName, String type, String data, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        mPromise = promise;

        String documentMimeType = "*/*";
        String jsonMimeType = "json";
        String fullFileName = fileName;

        if (currentActivity == null) {
            sendError(E_ACTIVITY_DOES_NOT_EXIST, "Current activity does not exist");
            return;
        }

        Log.d("react-native", fileName);
        //Log.d("react-native", data);
        try {
            if (type.equals(jsonMimeType)) {
                documentMimeType = "application/octet-stream";
                fullFileName = fileName + ".json";
            }
            DocumentData = data;
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            Bundle bundle = new Bundle();
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType(documentMimeType);
            intent.putExtra(Intent.EXTRA_TITLE, fullFileName);

            currentActivity.startActivityForResult(intent, REQUEST_CODE);
        } catch (Exception e) {
            sendError("Create Document Error", e.toString());
        }
    }

    protected void onCreateActivityResult(int resultCode, Intent intent, Promise promise) {
        Log.d("react-native", "Result onCreateActivityResult");
        mPromise = promise;

        if (resultCode == Activity.RESULT_CANCELED) {
            Log.d("react-native", "RESULT_CANCELED");
            sendError(E_CREATE_DOCUMENT_CANCELED, "User canceled creating document");
        }
        else if (resultCode == Activity.RESULT_OK) {
            Log.d("react-native", "RESULT_OK");

            Uri uri = null;
            if (intent != null) {
                uri = intent.getData();

                Log.d("react-native", uri.toString());

                // Perform operations on the document using its URI.
                if (uri == null) {
                    sendError(E_NO_URI_FOUND, "No Uri Found");
                } else {
                    writeDocument(uri);
                }
            }
        }
        else {
            sendError(E_UNKNOWN_ACTIVITY_RESULT, "Unknown activity result: " + resultCode);
        }
    }

    private void writeDocument(Uri uri) {
        try {
            Activity currentActivity = getCurrentActivity();
            ParcelFileDescriptor pfd = currentActivity.getContentResolver().openFileDescriptor(uri, "w");
            FileOutputStream fileOutputStream =
                    new FileOutputStream(pfd.getFileDescriptor());
            //fileOutputStream.write(("{\"Test\": \"This is test message\"}").getBytes());
            fileOutputStream.write(DocumentData.getBytes());
            fileOutputStream.close();
            pfd.close();
            mPromise.resolve(SUCCESS);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            sendError(E_WRITE_DOCUMENT_ERROR, e.toString());
        } catch (IOException e) {
            e.printStackTrace();
            sendError(E_WRITE_DOCUMENT_ERROR, e.toString());
        }
    }

    private void sendError(String code, String message) {
        if (mPromise != null) {
            mPromise.reject(code, message);
        }
    }
}