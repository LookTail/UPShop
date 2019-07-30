import React, { Component } from 'react'
import { SearchBar } from 'antd-mobile'

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

  onSubmit = (key) => {
    console.log("submit" + key);
    this.props.dataUpdate(key);
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
