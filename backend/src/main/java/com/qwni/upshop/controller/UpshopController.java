package com.qwni.upshop.controller;

import com.qwni.upshop.common.enums.RespCodeEnum;
import com.qwni.upshop.common.entity.Goods;
import com.qwni.upshop.common.response.BaseResp;
import com.qwni.upshop.service.CartService;
import com.qwni.upshop.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin("*")
public class UpshopController {
//    @Autowired
//    private KafkaTemplate kafkaTemplate;

    private GoodsService goodsService;
    private CartService cartService;

    @Autowired
    public UpshopController(GoodsService goodsService, CartService cartService) {
        this.goodsService = goodsService;
        this.cartService = cartService;
    }

    @RequestMapping(value = "goods/{page}", method = RequestMethod.GET)
    public BaseResp getGoodsByPage(@PathVariable int page) {
//        KafkaProducer kafka = new KafkaProducer(kafkaTemplate);
//        kafka.send("成功了哈哈哈");

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
    public BaseResp getCard() {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(cartService.getCart());
        return resp;
    }

    @RequestMapping(value = "cart/insert/{id}", method = RequestMethod.GET)
    public BaseResp insertCart(@PathVariable String id) {
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

    @RequestMapping(value = "cart/delete/{id}", method = RequestMethod.GET)
    public BaseResp deleteCart(@PathVariable String id) {
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

    @RequestMapping(value = "cart/amount/{id}/{amount}", method = RequestMethod.GET)
    public BaseResp amount(@PathVariable String id, @PathVariable String amount) {
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



}