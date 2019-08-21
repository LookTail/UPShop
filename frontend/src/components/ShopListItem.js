import React, { Component } from 'react'
import { Button, Modal, Toast } from 'antd-mobile'
import E from '../global.js';
import axios from 'axios'

const prompt = Modal.prompt;

export class ShopListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      added: false,
    }
  }

  changeAddStatus = () => {
    this.setState({
      added: !this.state.added,
    });
  }

  onClick = () => {
    if(window.localStorage.getItem("token")) {
      E.listener.call("addCart", this.props.item.id);
      this.changeAddStatus();   
    } else {
      prompt(
        '登录',
        '请输入用户名和密码',
        this.login,
        'login-password',
        null,
        ['用户名', '密码'],
      )
    }  
  }

  login = (id, pwd) => {
    let formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('pwd', pwd);
    console.log(id + pwd);
    axios.post('http://localhost:8080/login', formData).then((response) => {
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
    E.listener.add("addStatus"+this.props.item.id, this.changeAddStatus);

    return (
      <div style={{ padding: '0 15px' }}>
        <div
          style={{
            lineHeight: '50px',
            color: '#888',
            fontSize: '20px',
            fontWeight: 'bold',
            borderBottom: '1px solid #F0F0F0',
          }}
        >{this.props.item.title}</div>
        <div style={{ display: 'flex', padding: '15px 0' }}>
          <img style={{ height: '64px', marginRight: '15px' }} src={this.props.item.img} alt="" />
          <div style={{ lineHeight: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>{this.props.item.des}</div>
            <div style={{ marginBottom: '8px', fontSize: '11px', color: '#787878'}}>剩余：{this.props.item.sales}</div>
            <span style={{ fontSize: '18px', color: '#FF6E27' }}>¥{this.props.item.price}</span>
          </div>
          <div style={{ marginTop: 'auto', marginLeft: 'auto', marginRight: 2}}>
            <Button
              size = "small"
              type = "primary"
              disabled = {this.state.added}
              onClick = {this.onClick}
            >{this.state.added ? '已添加' : '添加'}</Button> 
          </div>
        </div>
      </div>
    )
  }
}

export default ShopListItem
