import React from 'react';
import { ListView, NavBar, Toast, NoticeBar } from 'antd-mobile';
import { Link } from 'react-router-dom';
import ShopListItem from '../components/ShopListItem';
import Search from '../components/Search';
import 'antd-mobile/dist/antd-mobile.css';
import axios from 'axios';
import CustomPopover from '../components/CustomPopover';
import LoginButton from '../components/LoginButton';

let dataBlobs = [];

class Shop extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    let isLogin = false;
    if(window.localStorage.getItem("token")) isLogin = true;

    this.state = {
      isLogin: isLogin,
      dataSource,
      isLoading: true,
      height: 561,
      visible: false,
      selected: '',
      page: 1,
      hasMore: true,
    };

    console.log("shop页面已加载");
  }

  componentDidMount() {
    Toast.loading("加载中", 0);
    this.requestGoodsData(this.state.page).then(data => {
      dataBlobs = dataBlobs.concat(data.result);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
      Toast.hide();
    });
  }

  onEndReached = (event) => {
    console.log('reach end', this.state.page);
    if (!this.state.hasMore) {
      return;
	  }
    this.setState({ isLoading: true });
    this.requestGoodsData(this.state.page + 1).then(data => {
      dataBlobs = dataBlobs.concat(data.result);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
        page: this.state.page + 1,
      });
    });
  }

  dataUpdate = (key) => {
    this.setState({ isLoading: true});
    this.searchGoodsData(key).then(data => {
      dataBlobs = data.result;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
    });
  }

  cancelSearch = () => {
    this.setState({ isLoading: true, page: 1, hasMore: true });
    this.requestGoodsData(this.state.page).then(data => {
      dataBlobs = data.result;
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
    });
  }

  requestGoodsData = async (page) => {
    // TODO 分页请求商品列表
    let data;
    await axios.get('http://localhost:8080/goods/'+page)
      .then((response) => {
        data = response.data;
      }  
    );
    if(data.result.length < 10) this.setState({ hasMore: false });
    return data;
  }

  searchGoodsData = async (key) => {
    let data;
    await axios.get('http://localhost:8080/goods/search/'+key)
      .then((response) => {
        data = response.data;
      });
    return data;
  }

  closeNoticeBar = () => {
    this.setState({
      height: 597
    })
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
          rightContent={ this.state.isLogin ?
            (<CustomPopover />) : 
            (<LoginButton />)
          }
        >商品列表</NavBar>
        <Search dataUpdate={this.dataUpdate.bind(this)} cancelSearch={this.cancelSearch.bind(this)} />
        <NoticeBar mode="closable" marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} onClick={this.closeNoticeBar}>
          <Link to='/rush'>周杰伦上海演唱会门票限时抢购即将开启，赶紧来抢购吧~</Link>
        </NoticeBar>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => (
            <div style={{ padding: '5px 30px', textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : '------------- 我是底线 -------------'}
            </div>)
          }
          renderRow={item => (<ShopListItem item={item} />)}
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

export default Shop;