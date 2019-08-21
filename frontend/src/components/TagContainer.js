import React, { Component } from 'react'
import { Tag } from 'antd-mobile'

export class TagContainer extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      data: props.data.map((obj) => ({ key: obj.key, value: obj.value})),
      selected: props.data.map((obj) =>({
        key: obj.key,
        val: false,
      }))
    }
  }

  onChange = (key, sel) => {
    // console.log(key+ "aa" + sel);
    let arr = this.state.selected.slice();
    // console.log(arr);
    arr.forEach((val, i, arr) => {
      if(i === key) arr[i].val = sel;
      else arr[i].val = false;
    })
    // console.log(arr);
    this.setState({
      selected: arr
    });

    this.props.passValue(this.state.data[key].value);
    
  }

  render() {
    let tags = [];
    this.state.data.forEach((item) => {
      tags.push((<Tag selected={this.state.selected[item.key].val} style={{marginLeft: '18px', width: '60px'}} key={item.key} onChange={(selected) => this.onChange(item.key, selected)}>{item.value}</Tag>))
    })
    return (
      <div style={{display: 'flex', paddingTop: '9px', flexDirection: 'row', flexWrap: 'wrap'}}>
        <span style={{lineHeight: '25px', color: '#303030'}}>{this.props.title}：</span>
        {tags}
      </div>
    )
  }
}

export default TagContainer
