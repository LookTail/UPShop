package com.qwni.upshop.service;

import com.qwni.upshop.common.entity.CartItem;
import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.common.entity.OrderItem;
import com.qwni.upshop.dao.CartDao;
import com.qwni.upshop.dao.OrderDao;
import com.qwni.upshop.kafka.KafkaProducer;
import com.qwni.upshop.utils.OrderIdGenerator;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderService {
    private static final Logger logger = Logger.getLogger(OrderService.class);

    private OrderDao orderDao;
    private CartDao cartDao;
    private KafkaProducer kafkaProducer;
    private ScheduledTask scheduledTask;

    @Autowired
    public OrderService(OrderDao orderDao, CartDao cartDao, KafkaProducer kafkaProducer, ScheduledTask scheduledTask) {
        this.orderDao = orderDao;
        this.cartDao = cartDao;
        this.kafkaProducer = kafkaProducer;
        this.scheduledTask = scheduledTask;
    }

    public List<Order> getOrderAll() {
        return orderDao.getOrderAll();
    }

    public String generateOrder() {
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
        String id = OrderIdGenerator.createID();
        order.setOrderId(id);
        order.setItemList(orderList);
        order.setTotalPrice(String.valueOf(totalPrice));

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(30000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (orderDao.insertOrder(order)) {
                    cartDao.deleteAll();
                }
            }
        }).start();

//        if (orderDao.insertOrder(order)) {
//            cartDao.deleteAll();
//            return id;
//        } else {
//            return "";
//        }
        return id;
    }

    public Boolean testOrder() {
        String id = OrderIdGenerator.createID();
        kafkaProducer.send(id);
        return true;
    }

    public Boolean deleteOrder() {
        return orderDao.deleteOrder();
    }

    public Boolean paymentNotify(String orderId) {
        if(orderDao.hasOrder(orderId)) {
            if(orderDao.changePaymentStatus(orderId)) {
                return true;
            } else {
//                System.out.println("数据库更新订单支付状态失败");
                logger.info("数据库更新订单支付状态失败");
                return false;
            }
        } else {
            logger.info("未找到订单信息，加入定时任务，订单号：" + orderId);
            scheduledTask.add(orderId);
            return true;
        }
    }

}
