import React, { Component } from 'react'
import { Tag } from 'antd-mobile'

export class TagContainer extends Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.state = {
      data: props.data,
      selected: props.data.map((obj) => false),
      disabled: this.props.data.map(obj => obj.disabled)
    }
    console.log(this.state.disabled)
  }

  onChange = (key, sel) => {
    // console.log(key+ "aa" + sel);
    let arr = this.state.selected.slice();
    arr.forEach((val, i, arr) => {
      if(i === key) arr[i] = sel;
      else arr[i] = false;
    })
    // console.log(arr);
    this.setState({
      selected: arr
    });
    // console.log(this.state.selected);

    this.props.passValue(key);  
  }

  render() {
    let tags = [];
    // console.log(this.state.selected);
    this.state.data.forEach((item, i) => {
      tags.push((<Tag selected={this.state.selected[i]} style={{marginLeft: '18px', width: '60px'}} key={item.key} onChange={(selected) => this.onChange(item.key,selected)} disabled={this.state.disabled[i]}>{item.value}</Tag>))
    })
    return (
      <div style={{display: 'flex', paddingTop: '9px', flexDirection: 'row', flexWrap: 'wrap'}}>
        <span style={{lineHeight: '25px', color: '#303030', width: '100px', textAlign: 'right'}}>{this.props.title}：</span>
        {tags}
      </div>
    )
  }
}

export default TagContainer
