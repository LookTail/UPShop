import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App';
import Rush from './pages/Rush'


export class CustomRouter extends Component {
  render() {
    return (
      <Router>
        <Route exact path='/' component={App}></Route>
        <Route exact path='/rush' component={Rush}></Route>
      </Router>
    )
  }
}

export default CustomRouter
