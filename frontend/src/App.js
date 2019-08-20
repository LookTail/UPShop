import React from 'react';
import './App.css';
import { TabBar } from 'antd-mobile';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Order from './pages/Order'
import 'antd-mobile/dist/antd-mobile.css';
import E from './global.js';
import axios from 'axios';

// window.localStorage.setItem("token", "2019081980254135");
// window.localStorage.removeItem("token");
axios.interceptors.request.use((config) => {
  config.headers = {
    'token': window.localStorage.getItem("token"),
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  if(response.data.code === '3') {
    window.localStorage.removeItem("token");
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      selectedTab: 'shopTab',
      shopBadge: 0,
    });
    E.listener.add("addCart", this.addCart);
    E.listener.add("deleteCart", this.deleteCart);
  }

  addCart = () => {
    this.setState({
      shopBadge: this.state.shopBadge + 1,
    });
  }

  deleteCart = () => {
    this.setState({
      shopBadge: this.state.shopBadge - 1,
    });
  }

  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
          prerenderingSiblingsNumber={2}
        >
          <TabBar.Item
            title="商品"
            key="商品"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
            />}
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
            />}
            selected={this.state.selectedTab === 'shopTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'shopTab',
              });
            }}
          >
            <Shop />
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://gw.alipayobjects.com/zos/rmsportal/asJMfBrNqpMMlVpeInPQ.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="购物车"
            key="购物车"
            badge={this.state.shopBadge}
            selected={this.state.selectedTab === 'cartTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'cartTab',
              });
            }}
          >
            <Cart />
          </TabBar.Item>
          <TabBar.Item
            title="订单"
            key="订单"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
            />}
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
            />}
            selected={this.state.selectedTab === 'orderTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'orderTab',
              });
            }}
          >
            <Order />
          </TabBar.Item>
        </TabBar>
      </div>
	  );
  }
}

export default App;