package com.project04.WebSuggestionSystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public int id;

    @ManyToOne
    @JoinColumn(name = "area_id")
    private PicArea area_id;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "post_photo")
    private String postPhoto;

    @Column(name = "pre_photo", nullable = false)
    private String prePhoto;

    @Column(name = "pre_status", nullable = false)
    private String preStatus;

    @Column(name = "post_status")
    private String postStatus;

    @Column(name = "suggest_name", nullable = false)
    private String suggestName;

    @Column(name = "suggestion", nullable = false)
    private String suggestion;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "worker_name")
    private String workerName;

    @Column(name = "modified_date")
    private LocalDateTime modifiedDate;

    // public String getArea_id() {
    //     return area_id.getArea() + " (" + area_id.getPicName() + ")";
    // }

    public PicArea getAreaId(){
        return area_id;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public int getId() {
        return id;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }
    
    public String getPostPhoto() {
        return postPhoto;
    }

    public String getPostStatus() {
        return postStatus;
    }

    public String getPrePhoto() {
        return prePhoto;
    }

    public String getPreStatus() {
        return preStatus;
    }
    
    public String getSuggestName() {
        return suggestName;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public String getTitle() {
        return title;
    }

    public String getWorkerName() {
        return workerName;
    }

    public void setArea_id(PicArea area_id) {
        this.area_id = area_id;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
    
    public void setId(int id) {
        this.id = id;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public void setPostPhoto(String postPhoto) {
        this.postPhoto = postPhoto;
    }

    public void setPostStatus(String postStatus) {
        this.postStatus = postStatus;
    }
    
    public void setPrePhoto(String prePhoto) {
        this.prePhoto = prePhoto;
    }
    
    public void setPreStatus(String preStatus) {
        this.preStatus = preStatus;
    }
    
    public void setSuggestName(String suggestName) {
        this.suggestName = suggestName;
    }
    
    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }


}
