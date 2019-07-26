import React, { Component } from 'react';
import { ListView, NavBar, Button, Toast } from 'antd-mobile';
import CartListItem from '../components/CartListItem';
import { GoodsData } from '../mockData.js';
import E from '../global.js'


let dataBlobs = [];

export class Cart extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        // if(row1 !== row2) console.log("r1:" + row1 + "   r2:" + row2 + "   不相等");
        // else console.log("r1:" + row1 + "   r2:" + row2 + "   相等");
        return row1 !== row2;
      },
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: 591,
      selected: '',
      page: 1,
    };
    E.listener.add("addCart", this.addCart);
    console.log("cart页面已加载");
  }

  componentDidMount() {
    // Toast.loading("加载中", 0);
	  setTimeout(() => {
      dataBlobs = dataBlobs.concat(this.requestGoodsData(this.state.page));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
      // Toast.hide();
	  }, 1000);
  }

  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
	  }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    dataBlobs = dataBlobs.concat(this.requestGoodsData(this.state.page + 1));
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
        page: this.state.page + 1,
      });
    }, 1000);
  }

  deleteItem = (id) => {
    this.setState({ isLoading: true});
    dataBlobs.splice(id, 1)
    let dataBlobs2 = JSON.parse(JSON.stringify(dataBlobs));    
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(dataBlobs2),
      isLoading: false,
    });
  }

  requestGoodsData = (page) => {
    // TODO 分页请求购物车列表
    // return GoodsData.slice(10*(page-1), 10*page);
    return []
  }

  addCart = (itemId) => {
    this.setState({ isLoading: true});
    dataBlobs = dataBlobs.concat(GoodsData[itemId]);
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
    }, 1000);
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
            <div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)
          }
          renderRow={(rowData, sectionId, rowId) => (<CartListItem item={rowData} rowId={rowId} deleteItem = {this.deleteItem.bind(this)} />)}
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
          <span style={{ fontSize: '14px', color: '#FFFFFF', lineHeight: '30px', marginLeft: '15px' }}>总金额：￥ 122</span>
          <div style={{ marginLeft: 'auto', marginRight: '15px'}}>
            <Button
              size = "small"
              type = "primary"
              style={{backgroundColor: '#00CC00'}}
            >下单</Button> 
          </div>
        </div>
      </div>
    );
  }
}

export default Cart
