import React from 'react';
import { ListView, NavBar, Toast } from 'antd-mobile';
import OrderListItem from '../components/OrderListItem';
import 'antd-mobile/dist/antd-mobile.css';

const data = [
  {
	  img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
	  title: 'Meet hotel',
	  des: '不是所有的兼职汪都需要风吹日晒不是所有的兼职汪都需要风吹日晒',
  },
  {
	  img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
		title: 'McDonald\'s invites you',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
		img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
		title: 'Eat the week',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
		img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
		title: 'Eat the week',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
		img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
		title: 'Eat the week',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
		img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
		title: 'Eat the week',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
		img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
		title: 'Eat the week',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
		img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
		title: 'Eat the week',
		des: '不是所有的兼职汪都需要风吹日晒',
  },
];

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
      visible: false,
      selected: '',
    };

    console.log("order页面已加载");
    
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
    // Toast.loading("加载中", 0);
	  setTimeout(() => {
      dataBlobs = dataBlobs.concat(data);
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
    dataBlobs = dataBlobs.concat(data);
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataBlobs),
        isLoading: false,
      });
    }, 1000);
  }

  dataUpdate = (newData) => {
    this.setState({ isLoading: true});
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newData),
        isLoading: false,
      });
    }, 1000);
  }

  cancelSearch = () => {
    this.setState({ isLoading: true});
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