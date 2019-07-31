package com.qwni.upshop.service;

import com.qwni.upshop.common.entity.CartItem;
import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.common.entity.OrderItem;
import com.qwni.upshop.dao.CartDao;
import com.qwni.upshop.dao.OrderDao;
import com.qwni.upshop.utils.OrderIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderService {
    private OrderDao orderDao;
    private CartDao cartDao;

    @Autowired
    public OrderService(OrderDao orderDao, CartDao cartDao) {
        this.orderDao = orderDao;
        this.cartDao = cartDao;
    }

    public List<Order> getOrderAll() {
        return orderDao.getOrderAll();
    }

    public Boolean generateOrder() {
        List<CartItem> cartList = cartDao.getCart();
        List<OrderItem> orderList = new ArrayList<OrderItem>();
        int totalPrice = 0;
        for(CartItem cartItem : cartList) {
            OrderItem orderItem = new OrderItem();
            orderItem.setId(cartItem.getId());
            orderItem.setTitle(cartItem.getTitle());
            orderItem.setAmount(cartItem.getAmount());
            orderItem.setPrice(cartItem.getPrice());
            orderList.add(orderItem);
            totalPrice += Integer.parseInt(cartItem.getPrice())* Integer.parseInt(cartItem.getAmount());
        }
        Order order = new Order();
        order.setOrderId(OrderIdGenerator.createID());
        order.setItemList(orderList);
        order.setTotalPrice(String.valueOf(totalPrice));
        return orderDao.insertOrder(order);
    }

    public Boolean deleteOrder() {
        return orderDao.deleteOrder();
    }

}
