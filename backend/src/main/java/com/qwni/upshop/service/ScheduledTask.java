package com.qwni.upshop.service;

import com.qwni.upshop.common.entity.Order;
import com.qwni.upshop.dao.OrderDao;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ScheduledTask {
    private static final Logger logger = Logger.getLogger(ScheduledTask.class);

    private static final byte[] lock = new byte[0];

    private OrderDao orderDao;
    private Map<Order, Integer> failedOrderMap;

    @Autowired
    public ScheduledTask(OrderDao orderDao) {
        this.orderDao = orderDao;
        this.failedOrderMap = new HashMap<>();
    }

    @Scheduled(cron = "0/10 * * * * ?")
    public void loopOrderCache() {
//        System.out.println("定时任务开始执行");
//        logger.info("定时任务开始执行");
        synchronized (lock) {
            Iterator it = this.failedOrderMap.entrySet().iterator();
            while (it.hasNext()) {
//                logger.info("当前定时任务列表:" + this.paidOrderList);
                Map.Entry entry = (Map.Entry) it.next();
                Order order = (Order) entry.getKey();
                if (orderDao.insertOrder(order)) {
//                    logger.info("修改订单状态成功");
                    System.out.println("定时任务重新插入订单成功");
                } else {
                    Integer newValue = (Integer) entry.getValue() + 1;
                    if(newValue < 5) {
                        failedOrderMap.replace(order, newValue);
                    } else {
                        failedOrderMap.remove(order);
                        System.out.println("异常订单: " + order.getOrderId());
                    }
                }
            }
        }
//        System.out.println(failedOrderMap.size());
    }

    @Scheduled(cron = "0/1 * * * * ?")
    public void deleteExpiredOrder() {
        orderDao.deleteExpiredOrder();
    }

    public void add(Order order) {
        synchronized (lock) {
            this.failedOrderMap.put(order, 0);
        }
    }
}
