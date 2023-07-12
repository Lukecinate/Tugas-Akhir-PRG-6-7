package com.example.project73.api;

import com.example.project73.model.Feedback;

import java.util.List;

import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface FeedbackService {
    @GET("getAllFeedback")
    Call<List<Feedback>> getAllFeedback();

    @GET("getAllFeedbackBefore")
    Call<List<Feedback>> getAllFeedbackBefore();

    @GET("getAllFeedbackOngoing")
    Call<List<Feedback>> getAllFeedbackOngoing();

    @GET("getAllFeedbackAfter")
    Call<List<Feedback>> getAllFeedbackAfter();

    @GET("getFeebackByKeywords")
    Call<List<Feedback>> search(@Query("keyword") String keyword);

    @POST("saveFeedback")
    Call<Feedback> saveFeedback(@Body Feedback feedback);

    @PUT("updateFeedback")
    Call<Feedback> update(@Path("id") String id, @Body Feedback feedback);

    @POST("upload")
    Call<String> uploadFile(@Part MultipartBody.Part file);
}
