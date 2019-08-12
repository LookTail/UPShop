package com.qwni.upshop.service;

import com.qwni.upshop.dao.OrderDao;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Component
public class ScheduledTask {
    private static final Logger logger = Logger.getLogger(ScheduledTask.class);

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
//        System.out.println("定时任务开始执行");
//        logger.info("定时任务开始执行");
        synchronized (lock) {
            Iterator<String> it = this.paidOrderList.iterator();
            while (it.hasNext()) {
                logger.info("当前定时任务列表:" + this.paidOrderList);
                String orderId = it.next();
                if (orderDao.hasOrder(orderId)) {
                    orderDao.changePaymentStatus(orderId);
                    logger.info("修改订单状态成功");
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
