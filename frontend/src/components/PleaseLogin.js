import React, { Component } from 'react'
import LoginButton from './LoginButton';

export class PleaseLogin extends Component {
  render() {
    return (
    <div style={{
      height: '641px',
      textAlign: 'center'
    }}>
      <span style={{lineHeight: '641px'}}>您还未登录，请{<LoginButton color='blue'/>}</span>
    </div>
    )
  }
}

export default PleaseLogin