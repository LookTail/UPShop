package com.qwni.upshop.service;

import com.qwni.upshop.utils.AuthManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

@Component
public class UserService {
    private AuthManager authManager;

    @Autowired
    public UserService(AuthManager authManager) {
        this.authManager = authManager;
    }

    public String login(String userId, String pwd) {
        String token = "";
        String md5Pwd = DigestUtils.md5DigestAsHex("123456".getBytes());
        if("niqiaowei".equals(userId) && md5Pwd.equals(pwd)) {
//            System.out.println("yes");
            token = authManager.login(userId);
        }
        return token;
    }

    public Boolean logout() {
        return authManager.logout();
    }
}
