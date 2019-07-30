package com.qwni.upshop.service;

import com.qwni.upshop.common.entity.Goods;
import com.qwni.upshop.dao.GoodsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GoodsService {
    private GoodsDao goodsDao;

    @Autowired
    public GoodsService(GoodsDao goodsDao) {
        this.goodsDao = goodsDao;
    }

    public List<Goods> getGoodsAll() {
        return goodsDao.getGoodsAll();
    }

    public List<Goods> getGoodsByPage(int page) {
        return goodsDao.getGoodsByPage(page);
    }

    public List<Goods> getGoodsByKey(String key) {
        return goodsDao.getGoodsByKey(key);
    }

}
