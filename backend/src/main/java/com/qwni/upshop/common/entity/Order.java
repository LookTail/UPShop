package com.qwni.upshop.common.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

@Document(collection = "order")
public class Order {
    private String orderId;
    private String totalPrice;
    private String status = "0"; // 0-未支付  1-已支付  默认0
    private Date createdAt;
    private List<OrderItem> itemList;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<OrderItem> getItemList() {
        return itemList;
    }

    public void setItemList(List<OrderItem> itemList) {
        this.itemList = itemList;
    }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object object) {
        if(this == object) return true;
        if(object instanceof Order) {
            Order order = (Order)object;
            return this.orderId.equals(order.orderId);
        } else {
            return false;
        }
    }

    @Override
    public final int hashCode() {
        int hashCode = 17;
        hashCode = hashCode * 31 + Integer.parseInt(this.orderId.substring(8));
        return hashCode;
    }
}
