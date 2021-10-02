package com.heartwarming;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.DatabaseErrorHandler;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.UserHandle;
import android.util.Log;
import android.view.Display;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.kakao.sdk.common.KakaoSdk;
import com.kakao.sdk.link.LinkClient;
import com.kakao.sdk.template.model.Link;
import com.kakao.sdk.template.model.TextTemplate;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;


public class KakaoLinkModule extends ReactContextBaseJavaModule {

    private static final String NAME = "RNKakaoLink";

    public static final int REQUEST_CODE = 100;

    KakaoLinkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void printTestLog(String name) {

        Activity currentActivity = getCurrentActivity();
        Context context = this.getReactApplicationContext();
        String message = "이것은 테스트입니다.";
        String webUrl = "https://developers.kakao.com";
        String mobileWebUrl = "https://developers.kakao.com";
        Log.d("KakaoLinkModule", "" + name);


        TextTemplate textTemplate = new TextTemplate(message, new Link(webUrl, mobileWebUrl));

        if(LinkClient.getInstance().isKakaoLinkAvailable(context)) {

            Log.d("KakaoLinkModule", "카카오링크 사용 가능");
            // 카카오톡으로 카카오링크 공유 가능
            /*
            LinkClient.getInstance().defaultTemplate(context, textTemplate) {
                (linkResult, error) -> {
                    if (error != null) {
                        Log.d("KakaoLinkModule", "카카오링크 보내기 실패");
                    } else if (linkResult != null) {
                        Log.d("KakaoLinkModule", "카카오링크 보내기 성공");
                        currentActivity.startActivityForResult(linkResult.intent, REQUEST_CODE);
                    }
                }
            }
            */

        } else {

        }
    }
}
