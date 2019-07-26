import React, { Component } from 'react'
import { Button } from 'antd-mobile'

const data = [
  {
	  title: '一号商品',
	  amount: '1',
	  sum: '23',
  },
  {
	  title: '2号商品',
		amount: '2',
		sum: '44',
  }
];

export class OrderListItem extends Component {
  renderOrderList() {
    return (
      data.map((item, i) => {
        return (
          <div style={{ display: 'flex', lineHeight: 1, width: '100%', paddingBottom: '15px' }} key={i}>
            <div style={{ fontSize: '14px', width: '80%' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#787878', width: '10%', lineHeight: '14px' }}>x {item.amount}</div>
            <span style={{ fontSize: '14px', color: '#404040' }}>{item.sum}</span>
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
        >订单编号</div>
        <div style={{ paddingTop: '15px', borderBottom: '1px solid #D0D0D0' }}>
          {this.renderOrderList()}
        </div>
        <div style={{ display: 'flex', padding: '15px 0' }}>
          <span style={{ fontSize: '14px', color: '#404040', lineHeight: '30px' }}>总金额： 122</span>
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
