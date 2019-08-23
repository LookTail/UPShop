package com.qwni.upshop.controller;

import com.qwni.upshop.common.annotation.AuthRequired;
import com.qwni.upshop.common.entity.Rush;
import com.qwni.upshop.common.enums.RespCodeEnum;
import com.qwni.upshop.common.response.BaseResp;
import com.qwni.upshop.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin("*")
public class UpshopController {
    private GoodsService goodsService;
    private CartService cartService;
    private OrderService orderService;
    private UserService userService;
    private RushService rushService;

    @Autowired
    public UpshopController(GoodsService goodsService, CartService cartService, OrderService orderService,
                            UserService userService, RushService rushService) {
        this.goodsService = goodsService;
        this.cartService = cartService;
        this.orderService = orderService;
        this.userService = userService;
        this.rushService = rushService;
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

    @AuthRequired
    @RequestMapping(value = "cart/get", method = RequestMethod.GET)
    public BaseResp getCart() {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(cartService.getCart());
        return resp;
    }

    @AuthRequired
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

    @AuthRequired
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

    @AuthRequired
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

    @AuthRequired
    @RequestMapping(value = "order/get", method = RequestMethod.GET)
    public BaseResp getOrder() {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        resp.setResult(orderService.getOrderAll());
        return resp;
    }

    @AuthRequired
    @RequestMapping(value = "order/generate", method = RequestMethod.POST)
    public BaseResp insertOrder() {
        BaseResp resp = new BaseResp();
        if(orderService.checkSalesAndReduce()) {
            String id = orderService.generateOrder();
            if (!id.isEmpty()) {
                resp.setCode(RespCodeEnum.SUCCESS.getCode());
                resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
                resp.setResult(id);
            } else {
                resp.setCode((RespCodeEnum.FAIL.getCode()));
                resp.setMsg(RespCodeEnum.FAIL.getMsg());
            }
        } else {
            resp.setCode((RespCodeEnum.SOLDOUT.getCode()));
            resp.setMsg(RespCodeEnum.SOLDOUT.getMsg());
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

    @RequestMapping(value = "login", method = RequestMethod.POST)
    public BaseResp login(@RequestParam(value = "id") String userId, @RequestParam(value="pwd") String password) {
        BaseResp resp = new BaseResp();
        String token = userService.login(userId, password);
//        System.out.println(token);
        if("".equals(token)) {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        } else {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
            resp.setResult(token);
        }
        return resp;
    }

    @RequestMapping(value = "logout", method = RequestMethod.GET)
    public BaseResp logout() {
        BaseResp resp = new BaseResp();
        if(userService.logout()) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

//    @AuthRequired
    @RequestMapping(value = "rush/get", method = RequestMethod.GET)
    public BaseResp getRushInfo() {
        BaseResp resp = new BaseResp();
        Rush result = rushService.getRushInfo();
        if(result != null) {
            resp.setCode(RespCodeEnum.SUCCESS.getCode());
            resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
            resp.setResult(result);
        } else {
            resp.setCode((RespCodeEnum.FAIL.getCode()));
            resp.setMsg(RespCodeEnum.FAIL.getMsg());
        }
        return resp;
    }

//    @AuthRequired
    @RequestMapping(value = "rush/go", method = RequestMethod.POST)
    public BaseResp rushGo(@RequestParam(value = "day") Integer day, @RequestParam(value="place") Integer place,
                           @RequestParam(value = "num") Integer num) {
        BaseResp resp = new BaseResp();
        if(rushService.hasRushed()) {
            if(rushService.go(day, place, num)) {
                resp.setCode(RespCodeEnum.SUCCESS.getCode());
                resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
            } else {
                resp.setCode((RespCodeEnum.FAIL.getCode()));
                resp.setMsg(RespCodeEnum.FAIL.getMsg());
            }
        } else {
            resp.setCode((RespCodeEnum.HASRUSHED.getCode()));
            resp.setMsg(RespCodeEnum.HASRUSHED.getMsg());
        }
        return resp;
    }

    @RequestMapping(value = "timeout", method = RequestMethod.GET)
    public BaseResp timeout() {
        BaseResp resp = new BaseResp();
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());

        try {
            Thread.sleep(30000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return resp;
    }

    @RequestMapping(value = "plain", method = RequestMethod.GET)
    public BaseResp plain() {
        BaseResp resp = new BaseResp();
//        System.out.println(Thread.currentThread().getId());
        try {
            Thread.sleep(200);
        } catch (Exception e) {

        }
        resp.setCode(RespCodeEnum.SUCCESS.getCode());
        resp.setMsg(RespCodeEnum.SUCCESS.getMsg());
        return resp;
    }


}