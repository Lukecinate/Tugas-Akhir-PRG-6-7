package com.example.project73.repository;

import android.content.Context;
import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.example.project73.api.ApiUtils;
import com.example.project73.api.FeedbackService;
import com.example.project73.model.Feedback;

import java.io.IOException;
import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FeedbackRepository {
    //Variable Const
    public static final String TAG ="FeedbackRepository";

    //Attribute
    private static FeedbackRepository INSTANCE;
    private FeedbackService feedbackService;
    private Context context;

    public FeedbackRepository(Context context) {
        feedbackService = ApiUtils.getFeedbackService();
        this.context = context;
    }

    public static void initialize(Context context){
        if (INSTANCE == null){
            INSTANCE = new FeedbackRepository(context);
        }
    }

    public static FeedbackRepository get(){
        return INSTANCE;
    }

    public MutableLiveData<List<Feedback>> getFeedbacks(){
        MutableLiveData<List<Feedback>> feedbacks = new MutableLiveData<>();

        Call<List<Feedback>> call = feedbackService.getAllFeedback();
        call.enqueue(new Callback<List<Feedback>>() {
            @Override
            public void onResponse(Call<List<Feedback>> call, Response<List<Feedback>> response) {
                if (response.isSuccessful()){
                    feedbacks.setValue(response.body());
                    Log.d(TAG, "getFeedbacks.onResponse() " );
                }
            }

            @Override
            public void onFailure(Call<List<Feedback>> call, Throwable t) {
                Log.e(TAG, t.getMessage());
            }
        });

        return feedbacks;
    }

    public MutableLiveData<List<Feedback>> getFeedbacksBefore(){
        MutableLiveData<List<Feedback>> feedbacks = new MutableLiveData<>();

        Call<List<Feedback>> call = feedbackService.getAllFeedbackBefore();
        call.enqueue(new Callback<List<Feedback>>() {
            @Override
            public void onResponse(Call<List<Feedback>> call, Response<List<Feedback>> response) {
                feedbacks.setValue(response.body());
                Log.d(TAG, "getFeedbacks.onResponse() called");
            }

            @Override
            public void onFailure(Call<List<Feedback>> call, Throwable t) {
                Log.e("Error : ", t.getMessage());
            }
        });

        return feedbacks;
    }

    public MutableLiveData<List<Feedback>> getFeedbacksAfter(){
        MutableLiveData<List<Feedback>> feedbacks = new MutableLiveData<>();

        Call<List<Feedback>> call = feedbackService.getAllFeedbackAfter();
        call.enqueue(new Callback<List<Feedback>>() {
            @Override
            public void onResponse(Call<List<Feedback>> call, Response<List<Feedback>> response) {
                feedbacks.setValue(response.body());
                Log.d(TAG, "getFeedbacks.onResponse() called");
            }

            @Override
            public void onFailure(Call<List<Feedback>> call, Throwable t) {
                Log.e("Error : ", t.getMessage());
            }
        });

        return feedbacks;
    }

    public MutableLiveData<List<Feedback>> getFeedbacksOngoing(){
        MutableLiveData<List<Feedback>> feedbacks = new MutableLiveData<>();

        Call<List<Feedback>> call = feedbackService.getAllFeedbackOngoing();
        call.enqueue(new Callback<List<Feedback>>() {
            @Override
            public void onResponse(Call<List<Feedback>> call, Response<List<Feedback>> response) {
                feedbacks.setValue(response.body());
                Log.d(TAG, "getFeedbacks.onResponse() called");
            }

            @Override
            public void onFailure(Call<List<Feedback>> call, Throwable t) {
                Log.e("Error : ", t.getMessage());
            }
        });

        return feedbacks;
    }

    public MutableLiveData<List<Feedback>> getFeedback(String keyword){
        MutableLiveData<List<Feedback>> feedback = new MutableLiveData<>();

        Call<List<Feedback>> call = feedbackService.search(keyword);
        call.enqueue(new Callback<List<Feedback>>() {
            @Override
            public void onResponse(Call<List<Feedback>> call, Response<List<Feedback>> response) {
                feedback.setValue(response.body());
                Log.d(TAG, "onResponse() called");
            }

            @Override
            public void onFailure(Call<List<Feedback>> call, Throwable t) {
                Log.e("Error : ", t.getMessage());
            }
        });

        return feedback;
    }

    public void addFeedback(Feedback feedback){
        Log.i(TAG, "addFeedback: called");
        Call<Feedback> call = feedbackService.saveFeedback(feedback);
        call.enqueue(new Callback<Feedback>() {
            @Override
            public void onResponse(Call<Feedback> call, Response<Feedback> response) {
                if(response.isSuccessful()){
                    Log.i(TAG, "Feedback added: " + feedback.getTitle());
                }
            }

            @Override
            public void onFailure(Call<Feedback> call, Throwable t) {
                Log.e("Error : ", t.getMessage());
            }
        });
    }

    public void updateFeedback(String id, Feedback feedback){
        Call<Feedback> call = feedbackService.update(id, feedback);
        call.enqueue(new Callback<Feedback>() {
            @Override
            public void onResponse(Call<Feedback> call, Response<Feedback> response) {
                if(response.isSuccessful()){
                    Log.i(TAG, "Feedback Updated: " + feedback.getTitle());
                }
            }

            @Override
            public void onFailure(Call<Feedback> call, Throwable t) {
                Log.e("Error : ", t.getMessage());
            }
        });
    }

    public MutableLiveData<ResponseBody> uploadfile(MultipartBody.Part file, int area_id, String created_date, String deadline, String pre_status, String suggest_name, String suggestion, String title) {
        MutableLiveData<ResponseBody> responseData = new MutableLiveData<>();
        Call<ResponseBody> call = feedbackService.uploadfile(file, area_id, created_date, deadline, pre_status, suggest_name, suggestion, title);
        Log.d(TAG, "File name or path file : " + file.toString());

        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                Log.d(TAG, "uploadFile.onResponse() Called");
                if (response.isSuccessful()){
                    Log.d(TAG, "uploadFile.onResponse() isSuccesful Called");
                    responseData.setValue(response.body());
                } else{
                    Log.d(TAG, "Response URL error message : " + response.raw().request().url().toString());
                    Log.d(TAG, "Error Code from API : " + response.code());
                    Log.e(TAG, "errorResponse : " + response.message().toString());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e(TAG, "API ERROR : " + t.getMessage());
            }
        });

        return responseData;
    }
}
