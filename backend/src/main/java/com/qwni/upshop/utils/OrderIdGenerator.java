package com.qwni.upshop.utils;

import java.util.Calendar;

public class OrderIdGenerator {
    private static final byte[] lock = new byte[0];

    // 位数，默认是8位
    private final static long w = 10000;

    public static String createID() {
        long r = 0;
        synchronized (lock) {
            r = (long) ((Math.random() + 1) * w);
        }
        Calendar calendar = Calendar.getInstance();
        String year = String.valueOf(calendar.get(Calendar.YEAR));
        String month;
        if(calendar.get(Calendar.MONTH) >= 9) {
            month = String.valueOf(calendar.get(Calendar.MONTH) + 1);
        } else {
            month = "0" + String.valueOf(calendar.get(Calendar.MONTH) + 1);
        }
        String day = String.valueOf(calendar.get(Calendar.DATE));

        return year + month + day + String.valueOf(r).substring(1);
    }

}
