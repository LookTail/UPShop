import React, { Component } from 'react'
import { Card, WingBlank, WhiteSpace, Stepper, Button } from 'antd-mobile'
import E from '../global';

export class CartListItem extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.item)
    this.state = {
      amount: this.props.item.amount,
      item : this.props.item,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      item : nextProps.item,
    });
    // console.log(nextProps.item.id + "updated" + this.props.item.id);
  }

  onChange = (val) => {
    this.setState({amount: val});
    this.props.stepperChange(val, this.state.item.id);
  }

  onClick = () => {
    E.listener.call("addStatus"+this.state.item.id, this.state.item.id);
    E.listener.call("deleteCart");
    this.props.deleteItem(this.props.item.id);    
  }

  render() {
    return (
      <WingBlank size="lg">
        <WhiteSpace size="lg" />
        <Card>
          <Card.Header
            title={this.state.item.title}
            thumb={"https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"}
            extra={
              <div style={{ float: 'right'}}>
                <Button size="small"  type="warning" onClick={this.onClick}>删除</Button>
              </div>
            }
          />
          <Card.Body>
            <div>{this.state.item.des}</div>
          </Card.Body>
          <Card.Footer
            style={{lineHeight: '34px'}}
            content={<span style={{ fontSize: '18px', color: '#FF6E27'}}>¥{this.props.item.price}</span>}
            extra=
              {<Stepper
                style={{ width: '100px', minWidth: '100px' }}
                showNumber
                max={99}
                min={1}
                value={this.state.amount}
                onChange={this.onChange}
              />} 
          />
        </Card>
        <WhiteSpace size="lg" />
      </WingBlank>
    )
  }
}

export default CartListItem
