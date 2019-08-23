package com.qwni.upshop.common.entity;

import java.util.List;

public class RushDays {
    private String string;
    private List<RushPlaces> places;

    public String getString() {
        return string;
    }

    public void setString(String string) {
        this.string = string;
    }

    public List<RushPlaces> getPlaces() {
        return places;
    }

    public void setPlaces(List<RushPlaces> places) {
        this.places = places;
    }
}
