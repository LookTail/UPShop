package com.qwni.upshop.service;

import com.qwni.upshop.utils.AuthManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserService {
    private AuthManager authManager;

    @Autowired
    public UserService(AuthManager authManager) {
        this.authManager = authManager;
    }

    public String login(String userId, String pwd) {
        String token = "";
        if("123456".equals(userId) && "123456".equals(pwd)) {
//            System.out.println("yes");
            token = authManager.login(userId);
        }
        return token;
    }

    public Boolean logout() {
        return authManager.logout();
    }
}
