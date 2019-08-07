import React, { Component } from 'react';
import { ListView, NavBar, Button, Toast } from 'antd-mobile';
import CartListItem from '../components/CartListItem';
import E from '../global.js';
import axios from 'axios';
import qs from 'qs';


let dataBlobs = [];

export class Cart extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => { return row1 !== row2; }
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: 591,
      selected: '',
      totalPrice: 0,
    };
    E.listener.add("addCart", this.addCart);
    console.log("cart页面已加载");
  }

  componentDidMount() {
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
    await axios.post('http://localhost:8080/cart/insert', qs.stringify({"id": id}))
      .then((response) => {
        if(response.data.code === "0") result = true; 
        else result = false;
      });   
    return result;
  }

  deleteCartItem = async (id) => {
    let result;
    console.log("delete called" + id);
    await axios.post('http://localhost:8080/cart/delete', qs.stringify({id: id}))
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
    await axios.post('http://localhost:8080/cart/amount', qs.stringify({id: id, amount: val}))
      .then((response) => {
        if(response.data.code === "0") result = true; 
        else result = false;
      });
    return result;

  }

  onClick = () => {
    Toast.loading("下单中，请稍后~", 0);
    let result;
    setTimeout(async () => {
      await axios.post('http://localhost:8080/order/generate')
      .then((response) => {
        if(response.data.code === "0") {
          Toast.success("下单成功~", 2, ()=>{ window.document.location.reload() });
          result = true; 
        } else {
          Toast.fail("下单失败~", 2);
          result = false;
        }
      });
    }, 3000);
    // await axios.get('http://localhost:8080/order/generate')
    //   .then((response) => {
    //     if(response.data.code === "0") {
    //       Toast.success("下单成功~", 2);
    //       result = true; 
    //     } else {
    //       Toast.fail("下单失败~", 2);
    //       result = false;
    //     }
    //   });
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

    return (
      <div>
        <NavBar 
          mode="light"
          style={{borderBottom: '1px solid #D0D0D0'}}
        >购物车</NavBar>
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
            >下单</Button> 
          </div>
        </div>
      </div>
    );
  }
}

export default Cart
