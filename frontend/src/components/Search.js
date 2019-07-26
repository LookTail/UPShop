import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'


const data = [
  {
	  img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
	  title: 'Meet hotel',
	  des: '不是所有的兼职汪都需要风吹日晒',
  },
];


export class Search extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       value: ''
    }
  }
  
  onChange = (value) => {
      this.setState({ value });
      console.log("change");
  }

  onSubmit = (value) => {
    console.log("submit" + value);
    this.props.dataUpdate(data);
  }

  onClear = (value) => {
    console.log("cancel");
    this.props.cancelSearch();
  }

  render() {
    return (
      <SearchBar 
        placeholder="搜索" maxLength={10}
        onFocus = {() => console.log("focus")}
        onChange = {this.onChange}
        onSubmit = {this.onSubmit}
        onClear = {this.onClear}
      />
    )
  }
}

export default Search
