import React, { Component } from 'react'
import axios from 'axios'
import { Toast, Modal } from 'antd-mobile'

const prompt = Modal.prompt;

export class LoginButton extends Component {
  login = (id, pwd) => {
    let formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('pwd', pwd);
    axios.post('http://localhost:8080/login', formData).then((response) => {
      console.log(response.data);
      if(response.data.code === '0') {
        window.localStorage.setItem("token", response.data.result);
        window.document.location.reload();
      } else {
        Toast.fail("用户名或密码错误", 2);
        setTimeout(
        () => prompt(
          '登录',
          '请输入用户名和密码',
          this.login,
          'login-password',
          null,
          ['用户名', '密码'],
        )
      , 2000)}
    });
  }
  
  render() {
    return (
      <button
        style={{color: this.props.color, padding: '1px 7px'}} 
        onClick={() => prompt(
          '登录',
          '请输入用户名和密码',
          this.login,
          'login-password',
          null,
          ['用户名', '密码'],
        )}
      >登录</button>
    )
  }
}

export default LoginButton
