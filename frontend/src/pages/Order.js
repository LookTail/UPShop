import React from 'react';
import { ListView, NavBar } from 'antd-mobile';
import OrderListItem from '../components/OrderListItem';
import 'antd-mobile/dist/antd-mobile.css';
import axios from 'axios';

let dataBlobs = [];

class Order extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: 641,
    };

    console.log("order页面已加载");  
  }

  componentDidMount() {
    this.requestOrderData().then( data => {
      dataBlobs = data.result;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
    });
    
  }

  requestOrderData = async () => {
    let data;
    await axios.get('http://localhost:8080/order/get')
      .then((response) => {
        data = response.data;
      });
    return data;
  }


  onEndReached = (event) => {
    console.log('reach end', event);
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
        >订单</NavBar>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: '5px 30px', textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : '------------- 我是底线 -------------'}
            </div>)
          }
          renderRow={item => (<OrderListItem item={item} />)}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          initialListSize = {10}
          pageSize={10}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={500}
        />
      </div>
    );
  }
}

export default Order;