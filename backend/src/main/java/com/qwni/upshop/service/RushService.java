package com.qwni.upshop.service;

import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.common.entity.OrderItem;
import com.qwni.upshop.common.entity.Rush;
import com.qwni.upshop.dao.OrderDao;
import com.qwni.upshop.dao.RushDao;
import com.qwni.upshop.utils.OrderIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Component
public class RushService {
    private RushDao rushDao;
    private OrderDao orderDao;

    @Autowired
    public RushService(RushDao rushDao, OrderDao orderDao) {
        this.rushDao = rushDao;
        this.orderDao = orderDao;
    }

    public Rush getRushInfo() {
        return rushDao.getRushInfo();
    }

    public Boolean hasRushed() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader("token");
        return rushDao.hashRushed(token);
    }

    public Boolean insertHasRushed() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader("token");
        return rushDao.insertHasRushed(token);
    }

    public Boolean go(Integer day, Integer place, Integer num) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String token = request.getHeader("token");

        Rush rush = rushDao.getRushInfo();
        Order order = new Order();
        List<OrderItem> orderList = new ArrayList<OrderItem>();

        OrderItem orderItem = new OrderItem();
        orderItem.setId("123");
        String title = rush.getTitle() + "-" + rush.getDays().get(day).getString() + "-" + rush.getDays().get(day).getPlaces().get(place).getString();
        orderItem.setTitle(title);
        orderItem.setAmount(num.toString());
        Integer totalPrice = rush.getDays().get(day).getPlaces().get(place).getPrice() * num;
        orderItem.setPrice(rush.getDays().get(day).getPlaces().get(place).getPrice().toString());
        orderList.add(orderItem);
        String id = OrderIdGenerator.createID();
        order.setOrderId(id);
        order.setItemList(orderList);
        order.setTotalPrice(String.valueOf(totalPrice));
        return rushDao.go(day, place, num) && rushDao.insertHasRushed(token) && orderDao.insertOrder(order);
    }
}
