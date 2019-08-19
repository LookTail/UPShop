package com.qwni.upshop.utils;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class TokenManager {
    private Map<String, String> tokenMap = new HashMap<>();

    public String generateToken(String userId) {
        String token = OrderIdGenerator.createID();
        tokenMap.put(token, userId);
        return token;
    }

    public void deleteToken(String token) {
        tokenMap.remove(token);
    }

    public Boolean hasToken(String token) {
        return tokenMap.containsKey(token);
    }

    public String getUserIdByToken(String token) {
        return tokenMap.get(token);
    }
}
