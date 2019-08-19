package com.qwni.upshop.common.enums;

public enum RespCodeEnum {
    SUCCESS("0", "成功"),
    FAIL("1", "失败"),
    LACK("2", "参数缺少"),
    LOGIN("3", "未登录");

    private String code;
    private String msg;

    RespCodeEnum(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
