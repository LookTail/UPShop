import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import CustomRouter from './CustomRouter'

// window.localStorage.removeItem("token");
axios.interceptors.request.use((config) => {
  config.headers = {
    'token': window.localStorage.getItem("token"),
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  if(response.data.code === '3') {
    window.localStorage.removeItem("token");
    window.document.location.reload();
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

ReactDOM.render(<CustomRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
