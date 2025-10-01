import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css'; // antd v5 기준 (v4라면 'antd/dist/antd.css')

import { Provider } from 'react-redux';
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import { thunk } from 'redux-thunk';
import Reducer from './_reducers';

// Redux DevTools 확장자 연결
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  Reducer,
  composeEnhancers(applyMiddleware(promiseMiddleware, thunk))
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
