package com.qwni.upshop.aop;

import com.qwni.upshop.common.enums.RespCodeEnum;
import com.qwni.upshop.common.response.BaseResp;
import com.qwni.upshop.utils.AuthManager;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthValidateAspect {
    private AuthManager authManager;

    @Autowired
    public AuthValidateAspect(AuthManager authManager) {
        this.authManager = authManager;
    }

    @Around(value = "@annotation(com.qwni.upshop.common.annotation.AuthRequired)")
    public Object authValidate(ProceedingJoinPoint pjp) {
        Object result = null;
        if(authManager.validate()) {
            try {
                result = pjp.proceed();
            } catch (Throwable throwable) {
                throwable.printStackTrace();
                BaseResp resp = new BaseResp();
                resp.setCode((RespCodeEnum.FAIL.getCode()));
                resp.setMsg(RespCodeEnum.FAIL.getMsg());
                result = resp;
            }
        } else {
            BaseResp resp = new BaseResp();
            resp.setCode((RespCodeEnum.LOGIN.getCode()));
            resp.setMsg(RespCodeEnum.LOGIN.getMsg());
            result = resp;
        }

        return result;
    }
}
