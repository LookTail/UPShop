import React, { Component } from 'react'
import { Button } from 'antd-mobile'

export class OrderListItem extends Component {

  renderOrderList() {
    return (
      this.props.item.itemList.map((item, i) => {
        return (
          <div style={{ display: 'flex', lineHeight: 1, width: '100%', paddingBottom: '15px' }} key={i}>
            <div style={{ fontSize: '14px', width: '70%' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#787878', width: '10%', lineHeight: '14px' }}>x {item.amount}</div>
            <span style={{ fontSize: '14px', color: '#404040' }}>单价: {item.price}</span>
          </div>
        );
      })
    );
  }

  render() {
    return (
      <div style={{ padding: '0 15px' }}>
        <div
          style={{
            lineHeight: '50px',
            color: '#888',
            fontSize: '20px',
            fontWeight: 'bold',
            borderBottom: '1px solid #D0D0D0',
          }}
        >订单编号: {this.props.item.orderId}</div>
        <div style={{ paddingTop: '15px', borderBottom: '1px solid #D0D0D0' }}>
          {this.renderOrderList()}
        </div>
        <div style={{ display: 'flex', padding: '15px 0' }}>
          <span style={{ fontSize: '14px', color: '#404040', lineHeight: '30px' }}>总金额：{this.props.item.totalPrice}</span>
          <div style={{ marginTop: 'auto', marginLeft: 'auto', marginRight: 2}}>
            <Button
              size="small"
              type="primary"
            >去支付</Button> 
          </div>
        </div>
      </div>
    )
  }
}

export default OrderListItem
