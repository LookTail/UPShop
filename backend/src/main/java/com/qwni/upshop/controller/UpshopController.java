package com.qwni.upshop.controller;

import com.qwni.upshop.common.enums.RespCodeEnum;
import com.qwni.upshop.common.entity.Goods;
import com.qwni.upshop.common.response.BaseResp;
import com.qwni.upshop.service.CartService;
import com.qwni.upshop.service.GoodsService;
import com.qwni.upshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin("*")
public class UpshopController {
    private GoodsService goodsService;
    private CartService cartService;
    private OrderService orderService;

    @Autowired
    public UpshopController(GoodsService goodsService, CartService cartService, OrderService orderService) {
        this.goodsService = goodsService;
        this.cartService = cartService;
        this.orderService = orderService;
    }

    @RequestMapping(value = "goods/{page}", method = RequestMethod.GET)
    public BaseResp getGoodsByPage(@PathVariable int page) {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(goodsService.getGoodsByPage(page));
        return resp;
    }

    @RequestMapping(value = "goods/search/{key}", method = RequestMethod.GET)
    public BaseResp getGoodsByKey(@PathVariable String key) {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(goodsService.getGoodsByKey(key));
        return resp;
    }

    @RequestMapping(value = "cart/get", method = RequestMethod.GET)
    public BaseResp getCart() {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(cartService.getCart());
        return resp;
    }

    @RequestMapping(value = "cart/insert", method = RequestMethod.POST)
    public BaseResp insertCart(@RequestParam(value = "id") String id) {
        BaseResp resp = new BaseResp();
        if(cartService.insert(id)) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "cart/delete", method = RequestMethod.POST)
    public BaseResp deleteCart(@RequestParam(value = "id") String id) {
        BaseResp resp = new BaseResp();
        if(cartService.delete(id)) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "cart/amount", method = RequestMethod.POST)
    public BaseResp amount(@RequestParam(value = "id") String id, @RequestParam(value = "amount") String amount) {
        BaseResp resp = new BaseResp();
        if(cartService.amount(id, amount)) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "order/get", method = RequestMethod.GET)
    public BaseResp getOrder() {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(orderService.getOrderAll());
        return resp;
    }

    @RequestMapping(value = "order/generate", method = RequestMethod.POST)
    public BaseResp insertOrder() {
        BaseResp resp = new BaseResp();
        String id = orderService.generateOrder();
        if(!id.isEmpty()) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
            resp.setResult(id);
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "order/delete", method = RequestMethod.GET)
    public BaseResp deleteOrder() {
        BaseResp resp = new BaseResp();
        if(orderService.deleteOrder()) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "order/test", method = RequestMethod.GET)
    public BaseResp testOrder() {
        BaseResp resp = new BaseResp();
        if(orderService.testOrder()) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "order/notify", method = RequestMethod.POST)
    public BaseResp notify(@RequestParam (value="orderId") String orderId) {
        BaseResp resp = new BaseResp();
        if(orderService.paymentNotify(orderId)) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }


}