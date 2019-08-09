package com.qwni.upshop.service;

import com.qwni.upshop.dao.OrderDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Component
public class ScheduledTask {
    private static final byte[] lock = new byte[0];

    private OrderDao orderDao;
    private List<String> paidOrderList;

    @Autowired
    public ScheduledTask(OrderDao orderDao) {
        this.orderDao = orderDao;
        this.paidOrderList = new ArrayList<>();
    }

    @Scheduled(cron = "0/10 * * * * ?")
    public void loopOrderCache() {
        System.out.println("定时任务开始执行");
        synchronized (lock) {
            Iterator<String> it = this.paidOrderList.iterator();
            while (it.hasNext()) {
                System.out.println(this.paidOrderList);
                String orderId = it.next();
                if (orderDao.hasOrder(orderId)) {
                    orderDao.changePaymentStatus(orderId);
                    System.out.println("修改订单状态成功");
                    it.remove();
                }
            }
        }
    }

    public void add(String orderId) {
        synchronized (lock) {
            this.paidOrderList.add(orderId);
        }
    }
}
