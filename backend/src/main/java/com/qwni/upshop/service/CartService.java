package com.qwni.upshop.service;

import com.qwni.upshop.common.entity.Cart;
import com.qwni.upshop.common.entity.CartItem;
import com.qwni.upshop.common.entity.Goods;
import com.qwni.upshop.dao.CartDao;
import com.qwni.upshop.dao.GoodsDao;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CartService {
    private CartDao cartDao;
    private GoodsDao goodsDao;

    @Autowired
    public CartService(CartDao cartDao, GoodsDao goodsDao) {
        this.cartDao = cartDao;
        this.goodsDao = goodsDao;
    }

    public Cart getCart() {
        List<CartItem> list = cartDao.getCart();
        Cart cart = new Cart();
        int totalPrice = 0;
        for(CartItem item : list) {
            totalPrice += Integer.parseInt(item.getPrice());
        }
        cart.setTotalPrice(String.valueOf(totalPrice));
        cart.setItemList(list);
        return cart;
    }

    public Boolean insert(String id) {
        Goods goods = goodsDao.getGoodsById(id);
        CartItem item = new CartItem();
        item.setId(goods.getId());
        item.setTitle(goods.getTitle());
        item.setDes(goods.getDes());
        item.setPrice(goods.getPrice());
        item.setAmount("1");
        return cartDao.insert(item);
    }

    public Boolean delete(String id) {
        return cartDao.delete(id);
    }

}
