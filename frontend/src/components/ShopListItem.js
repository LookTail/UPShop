import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import E from '../global.js';

export class ShopListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added: false,
    }

  }

  changeAddStatus = () => {
    this.setState({
      added: !this.state.added,
    });
  }

  onClick = () => {
    E.listener.call("addCart", this.props.item.id);
    this.changeAddStatus();    
  }

  render() {
    E.listener.add("addStatus"+this.props.item.id, this.changeAddStatus);

    return (
      <div style={{ padding: '0 15px' }}>
        <div
          style={{
            lineHeight: '50px',
            color: '#888',
            fontSize: '20px',
            fontWeight: 'bold',
            borderBottom: '1px solid #F0F0F0',
          }}
        >{this.props.item.title}</div>
        <div style={{ display: 'flex', padding: '15px 0' }}>
          <img style={{ height: '64px', marginRight: '15px' }} src={this.props.item.img} alt="" />
          <div style={{ lineHeight: 1 }}>
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>{this.props.item.des}</div>
            <div style={{ marginBottom: '8px', fontSize: '11px', color: '#787878'}}>销量：{this.props.item.sales}</div>
            <span style={{ fontSize: '18px', color: '#FF6E27' }}>¥{this.props.item.price}</span>
          </div>
          <div style={{ marginTop: 'auto', marginLeft: 'auto', marginRight: 2}}>
            <Button
              size = "small"
              type = "primary"
              disabled = {this.state.added}
              onClick = {this.onClick}
            >{this.state.added ? '已添加' : '添加'}</Button> 
          </div>
        </div>
      </div>
    )
  }
}

export default ShopListItem
