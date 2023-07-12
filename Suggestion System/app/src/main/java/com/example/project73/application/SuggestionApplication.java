package com.example.project73.application;

import android.app.Application;
import android.util.Log;

import com.example.project73.repository.FeedbackRepository;

public class SuggestionApplication extends Application {
public static final String TAG = "FeedbackApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i(TAG, "FeedbackApplication.initialize() onCalled");
        FeedbackRepository.initialize(this);
    }
}