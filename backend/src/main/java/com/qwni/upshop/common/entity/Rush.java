package com.qwni.upshop.common.entity;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rush")
public class Rush {
    private String title;
    private Integer limit;
    private List<RushDays> days;
    private List<String> hasRushed;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public List<RushDays> getDays() {
        return days;
    }

    public void setDays(List<RushDays> days) {
        this.days = days;
    }

    public List<String> getHasRushed() {
        return hasRushed;
    }

    public void setHasRushed(List<String> hasRushed) {
        this.hasRushed = hasRushed;
    }
}
