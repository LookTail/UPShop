import React from 'react';
import { ListView, NavBar, Popover, Icon, Toast } from 'antd-mobile';
import ShopListItem from '../components/ShopListItem';
import Search from '../components/Search';
import 'antd-mobile/dist/antd-mobile.css';
import axios from 'axios';
// import E from '../global.js';

let dataBlobs = [];

const Item = Popover.Item;

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;

class Shop extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: 597,
      visible: false,
      selected: '',
      page: 1,
      hasMore: true,
    };

    console.log("shop页面已加载");
  }

  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

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

  // refresh = () => {
  //   // dataBlobs = [];
  //   console.log("shop refresh called");
  //   this.setState({
  //     page: 1,
  //     hasMore: true,
  //   });
  //   this.requestGoodsData(this.state.page).then(data => {
  //     // dataBlobs = dataBlobs.concat(data.result);
  //     dataBlobs = data.result;
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
  //       isLoading: false,
  //     });
  //   });
  // }

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
          rightContent={
            <Popover
              overlayClassName="fortest"
              overlayStyle={{ color: 'currentColor' }}
              visible={this.state.visible}
              overlay={[
                (<Item key="4" value="scan" icon={myImg('tOtXhkIWzwotgGSeptou')} data-seed="logId">Scan</Item>),
                (<Item key="5" value="special" icon={myImg('PKAgAqZWJVNwKsAJSmXd')} style={{ whiteSpace: 'nowrap' }}>My Qrcode</Item>),
                (<Item key="6" value="button ct" icon={myImg('uQIYTFeRrjPELImDRrPt')}>
                  <span style={{ marginRight: 5 }}>Help</span>
                </Item>),
              ]}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [-10, 0],
              }}
              onVisibleChange={this.handleVisibleChange}
              onSelect={this.onSelect}
            >
            <div
              style={{
                height: '100%',
                padding: '0 15px',
                marginRight: '-15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon type="ellipsis" color="#000" />
            </div>
          </Popover>}
        >商品列表</NavBar>
        <Search dataUpdate={this.dataUpdate.bind(this)} cancelSearch={this.cancelSearch.bind(this)} />
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