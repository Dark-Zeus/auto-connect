import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer, Bounce } from 'react-toastify';
import { configureStore } from '@reduxjs/toolkit';
import reportWebVitals from './reportWebVitals';

import store from './store/store';

import App from './App';

import './css/tailwind.css';
import './css/theme.css'
import './css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ToastContainer
      theme="light"
      transition={Bounce}
    />
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
