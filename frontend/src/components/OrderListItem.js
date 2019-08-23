import React, { Component } from 'react'
import { Button, ActionSheet, Toast } from 'antd-mobile'
import picUrl from '../assets/unionpay.png';
import axios from 'axios'

export class OrderListItem extends Component {
  dataList = [
    { url: picUrl, title: '云闪付' },
    { url: 'https://gw.alipayobjects.com/zos/rmsportal/OpHiXAcYzmPQHcdlLFrc.png', title: '支付宝' },
    { url: 'https://gw.alipayobjects.com/zos/rmsportal/umnHwvEgSyQtXlZjNJTt.png', title: '微信支付' },
  ].map(obj => ({
    icon: <img src={obj.url} alt={obj.title} style={{ width: 36 }} />,
    title: obj.title,
  }));

  renderOrderList() {
    return (
      this.props.item.itemList.map((item, i) => {
        return (
          <div style={{ display: 'flex', lineHeight: 1, width: '100%', paddingBottom: '15px' }} key={i}>
            <div style={{ fontSize: '14px', width: '60%' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#787878', width: '20%', lineHeight: '14px', textAlign: 'right', paddingRight: '15px' }}>x {item.amount}</div>
            <span style={{ fontSize: '14px', color: '#404040', width: '20%' }}>单价: {item.price}</span>
          </div>
        );
      })
    );
  }

  onClick = () => {
    this.showShareActionSheet();
  }

  showShareActionSheet = () => {
    ActionSheet.showShareActionSheetWithOptions({
      options: this.dataList,
      message: '请选择支付方式',
    },
    (buttonIndex) => {
      if(buttonIndex > -1) {
        let message;
        this.paymentNotify(this.props.item.orderId).then((result) => {
          message = result ? '支付成功' : '支付失败';
          Toast.success(message, 3, ()=>{ window.document.location.reload()});
        });
      } else {
        // window.document.location.reload();
      }  
    });
  }
  
  paymentNotify = async (id) => {
    let result;
    let formData = new URLSearchParams();
    formData.append('orderId', id);
    await axios.post('http://localhost:8080/order/notify', formData)
      .then((response) => {
        if(response.data.code === "0") result = true; 
        else result = false;
      });
    return result;
  }

  render() {
    return (
      <div style={{ padding: '0 15px' }}>
        <div
          style={{
            lineHeight: '50px',
            color: '#888',
            fontSize: '20px',
            fontWeight: 'bold',
            borderBottom: '1px solid #D0D0D0',
          }}
        >订单编号: {this.props.item.orderId}</div>
        <div style={{ paddingTop: '15px', borderBottom: '1px solid #D0D0D0' }}>
          {this.renderOrderList()}
        </div>
        <div style={{ display: 'flex', padding: '15px 0' }}>
          <span style={{ fontSize: '14px', color: '#404040', lineHeight: '30px' }}>总金额：{this.props.item.totalPrice}</span>
          <div style={{ marginTop: 'auto', marginLeft: 'auto', marginRight: 2}}>
            <Button
              size="small"
              type="primary"
              disabled={this.props.item.status === '0' ? false : true}
              onClick={this.onClick}
            >{this.props.item.status === '0' ? '去支付' : '已支付'}</Button> 
          </div>
        </div>
      </div>
    )
  }
}

export default OrderListItem
