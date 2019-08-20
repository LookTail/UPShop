import React, { Component } from 'react';
import manUrl from '../assets/man.png';
import logoutUrl from '../assets/logout.png';
import { Popover, Icon } from 'antd-mobile';
import axios from 'axios'

const Item = Popover.Item;

export class CustomPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selected: '',
    };
  }

  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
    if(opt.props.value === 'logout') {
      axios.get('http://localhost:8080/logout').then((response) => {
        window.localStorage.removeItem("token");
        window.document.location.reload();
      });
    }
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  render() {
    return (
      <Popover
        overlayClassName="fortest"
        overlayStyle={{ color: 'currentColor' }}
        visible={this.state.visible}
        overlay={[
          (<Item key="1" value="id" icon={<img src={manUrl} className="am-icon am-icon-xs" alt="" />}>用户:aaa</Item>),
          (<Item key="2" value="logout" icon={<img src={logoutUrl} className="am-icon am-icon-xs" alt=""/>}>退出</Item>),
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
    </Popover>)
    
  }
}

export default CustomPopover
