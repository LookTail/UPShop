package com.qwni.upshop.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Component
public class AuthManager {
    private TokenManager tokenManager;

    @Autowired
    public AuthManager(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
    }

    private String getTokenFromHeader() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            return request.getHeader("token");
        } catch (Exception e) {
            return "";
        }
    }

    public String login(String userId) {
        return tokenManager.generateToken(userId);
    }

    public void logout() {
        String token = getTokenFromHeader();
        if(!StringUtils.isEmpty(token)) {
            tokenManager.deleteToken(token);
        } else {
            System.out.println("登出不对啊，没有token登出啥呢？");
        }
    }

    public Boolean validate() {
        String token = getTokenFromHeader();
        if(!StringUtils.isEmpty(token)) {
            return tokenManager.hasToken(token);
        } else {
            return false;
        }
    }

}
