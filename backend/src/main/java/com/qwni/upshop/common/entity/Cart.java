package com.qwni.upshop.common.entity;

import java.util.List;

public class Cart {
    private String totalPrice;
    private List<CartItem> itemList;

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<CartItem> getItemList() {
        return itemList;
    }

    public void setItemList(List<CartItem> itemList) {
        this.itemList = itemList;
    }
}
