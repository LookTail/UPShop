import React, { Component } from 'react'
import { Button, ActionSheet, Toast, Modal } from 'antd-mobile'
import picUrl from '../assets/unionpay.png';
import axios from 'axios'
import E from '../global';

const alert = Modal.alert;

export class OrderListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftSecond: 0,
      leftMinute: 0,
    }
  }

  componentDidMount() {
    if(this.props.item.createdAt !== null) { 
      this.timeCount();
    }
  }

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

  cancelClick = () => {
    
    alert('删除订单', '确认删除订单？', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确认', onPress: this.deleteOrder },
    ])
    
  }

  deleteOrder = () => {
    let formData = new URLSearchParams();
    formData.append('orderId', this.props.item.orderId);
    axios.post('http://localhost:8080/order/delete', formData)
      .then((response) => {
        if(response.data.code === "0") E.listener.call("updateOrderList"); 
        else console.log("删除订单失败");
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

  timeCount = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let expire = new Date(this.props.item.createdAt);
    expire.setMinutes(expire.getMinutes() + 10);
    // console.log(expire);
    let hour = expire.getHours();
    let minute = expire.getMinutes();
    let second = expire.getSeconds();
    let nowTime = Date.now();
    let time = Number(new Date(year,month,day,hour,minute,second));
    let timeDiff = Math.round((time - nowTime)/1000);
    // let leftHour = parseInt(timeDiff/3600%24);
    let leftMinute = parseInt(timeDiff/60%60);
    let leftSecond = timeDiff%60;
    this.setState({
      leftMinute: leftMinute,
      leftSecond: leftSecond
    })
    if(leftMinute <=0 && leftSecond <=0) {
      E.listener.call("updateOrderList");
      return;
    }
    setTimeout(this.timeCount, 1000);  
  }

  render() {
    let timeCount = (this.state.leftMinute < 10 ? '0'+this.state.leftMinute : this.state.leftMinute) + ' : ' + (this.state.leftSecond < 10 ? '0'+this.state.leftSecond : this.state.leftSecond);
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
          <div style={{marginLeft: 'auto'}}></div>
          {this.state.leftMinute > 0 || this.state.leftSecond > 0 ? (
            <span style={{ fontSize: '14px', color: '#F00000', lineHeight: '30px', marginRight: '10px'}}>{timeCount}</span>
          ) : null }
          {this.state.leftMinute > 0 || this.state.leftSecond > 0 ? (   
            <div style={{ marginTop: 'auto', marginRight: '10px'}}>
              <Button
                size="small"
                type="primary"
                onClick={this.cancelClick}
                style={{backgroundColor: '#F00000'}}
              >取消订单</Button> 
            </div>
          ) : null }
          <div style={{ marginTop: 'auto', marginRight: '2px'}}>
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
