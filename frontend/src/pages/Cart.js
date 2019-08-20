import React, { Component } from 'react';
import { ListView, NavBar, Button, Toast, ActionSheet } from 'antd-mobile';
import CartListItem from '../components/CartListItem';
import E from '../global.js';
import axios from 'axios';
import qs from 'qs';
import picUrl from '../assets/unionpay.png';
import PleaseLogin from '../components/PleaseLogin';
import CustomPopover from '../components/CustomPopover';

let dataBlobs = [];

export class Cart extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => { return row1 !== row2; }
    });
    let isLogin = false;
    if(window.localStorage.getItem("token")) isLogin = true;
    this.state = {
      isLogin: isLogin,
      dataSource,
      isLoading: true,
      height: 591,
      selected: '',
      totalPrice: 0,
      orderId: '',
    };
    E.listener.add("addCart", this.addCart);
    console.log("cart页面已加载");
  }

  dataList = [
    { url: picUrl, title: '云闪付' },
    { url: 'https://gw.alipayobjects.com/zos/rmsportal/OpHiXAcYzmPQHcdlLFrc.png', title: '支付宝' },
    { url: 'https://gw.alipayobjects.com/zos/rmsportal/umnHwvEgSyQtXlZjNJTt.png', title: '微信支付' },
  ].map(obj => ({
    icon: <img src={obj.url} alt={obj.title} style={{ width: 36 }} />,
    title: obj.title,
  }));

  componentDidMount() {
    if(this.state.isLogin) {
      this.setState({ isLoading: true });
      this.requestCartData().then( data => {
        dataBlobs = dataBlobs.concat(data.itemList);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
          isLoading: false,
          totalPrice: data.totalPrice,
        });
      });
    }    
  }

  onEndReached = (event) => {
    if (this.state.isLoading) {
      return;
	  }
    console.log('reach end', event);
  }

  deleteItem = (itemId) => {
    this.setState({ isLoading: true});
    this.deleteCartItem(itemId).then(s => {
      if(s) {
        this.requestCartData().then((data) => {
          dataBlobs = data.itemList;
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
            isLoading: false,
            totalPrice: data.totalPrice,
          });
        });
      } else {
        console.log("删除购物车失败！！！");
      }
    });
  }

  addCart = (itemId) => {
    this.setState({ isLoading: true});
    console.log("id:" + itemId);    
    this.insertCartItem(itemId).then(s => {
      if(s) {
        this.requestCartData().then((data) => {
          dataBlobs = data.itemList;
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
            isLoading: false,
            totalPrice: data.totalPrice,
          });
        });
      } else {
        console.log("插入购物车失败！！！");
      }
    });
  }

  insertCartItem = async (id) => {
    let result;
    let formData = new URLSearchParams();
    formData.append('id', id);
    await axios.post('http://localhost:8080/cart/insert', formData)
      .then((response) => {
        if(response.data.code === "0") result = true; 
        else result = false;
      });   
    return result;
  }

  deleteCartItem = async (id) => {
    let result;
    let formData = new URLSearchParams();
    formData.append('id', id);
    await axios.post('http://localhost:8080/cart/delete', formData)
      .then((response) => {
        if(response.data.code === "0") result = true; 
        else result = false;
      });
    return result;
  }

  requestCartData = async () => {
    // TODO 请求商品列表
    let data;
    await axios.get('http://localhost:8080/cart/get')
      .then((response) => {
        data = response.data;
      }); 
    return data.result;
  }

  stepperChange = (val, id) => {
    this.requestAmount(val, id).then((r) => {
      if(r) {
        this.requestCartData().then((data) => {
          dataBlobs = data.itemList;
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
            totalPrice: data.totalPrice,
          });
        });
      } else {
        console.log("步进器改数量错误！！！");
      }
    });
  }

  requestAmount = async (val, id) => {
    let result;
    let formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('amount', val);
    await axios.post('http://localhost:8080/cart/amount', formData)
      .then((response) => {
        if(response.data.code === "0") result = true; 
        else result = false;
      });
    return result;

  }

  onClick = () => {
    Toast.loading("下单中，请稍后~", 0);
    setTimeout(async () => {
      await axios.post('http://localhost:8080/order/generate')
      .then((response) => {
        if(response.data.code === "0") {
          // Toast.success("下单成功~", 2, ()=>{ window.document.location.reload() });
          this.setState({ orderId: response.data.result });
          Toast.success("下单成功，请继续完成支付", 2);
          setTimeout(() => this.showShareActionSheet(), 2000)
        } else {
          Toast.fail("下单失败~", 2);
        }
      });
    }, 3000);
  }

  showShareActionSheet = () => {
    ActionSheet.showShareActionSheetWithOptions({
      options: this.dataList,
      message: '请选择支付方式',
    },
    (buttonIndex) => {
      if(buttonIndex > -1) {
        let message;
        this.paymentNotify(this.state.orderId).then((result) => {
          message = result ? '支付成功' : '支付失败';
          Toast.success(message, 3, ()=>{ window.document.location.reload()});
        });
      } else {
        window.document.location.reload();
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
	  const separator = (sectionID, rowID) => {
      return (
	      <div
          key={`${sectionID}+${rowID}`}
          style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
          }}
        />
      );
    }
    const isLogin = this.state.isLogin;

    return (  
      <div>
        <NavBar 
          mode="light"
          style={{borderBottom: '1px solid #D0D0D0'}}
          rightContent={ this.state.isLogin ?(<CustomPopover />) : null}
        >购物车</NavBar>
        { isLogin ? (
          <div>
            <ListView
              ref={el => this.lv = el}
              dataSource={this.state.dataSource}
              renderFooter={() => (
                <div style={{ padding: '5px 30px', textAlign: 'center' }}>
                  {this.state.isLoading ? 'Loading...' : '------------- 我是底线 -------------'}
                </div>)
              }
              renderRow={(item) => (<CartListItem item={item} deleteItem={this.deleteItem.bind(this)} stepperChange={this.stepperChange.bind(this)}/>)}
              renderSeparator={separator}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
              initialListSize = {10}
              pageSize={10}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={500}
            />
            <div style={{ display: 'flex', padding: '10px 0', height: '50px', backgroundColor: '#808080' }}>
              <span style={{ fontSize: '14px', color: '#FFFFFF', lineHeight: '30px', marginLeft: '15px' }}>总金额：￥{this.state.totalPrice}</span>
              <div style={{ marginLeft: 'auto', marginRight: '15px'}}>
                <Button
                  size = "small"
                  type = "primary"
                  style={{backgroundColor: '#00CC00'}}
                  onClick={this.onClick}
                >下单并支付</Button>
              </div>
            </div>
          </div>
          ) : (
          <PleaseLogin />
          )}
      </div>
    );
  }
}

export default Cart
