// tslint:disable no-import-side-effect
// tslint:disable no-submodule-imports
// This must be the first line in src/index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'tslib';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Router from './router';
import store from './store';
import './assets/styles/main.scss';
import './fontawesome';

// setting this to true will enable some components
// to render as though they were on a touch device.
// TODO: DO NOT SET TO TRUE in PRODUCTION! FORCE to false somehow.
const SIMULATE_TOUCH = false;

const checkSimulateTouch = () => {
  if( SIMULATE_TOUCH ) {
    document['ontouchstart'] = (ev: TouchEvent) => null;
  }
  return null;
}

const Root = () => (
  <React.StrictMode>
    <Provider store={store}>
      { checkSimulateTouch() }
      <Router />
    </Provider>
  </React.StrictMode>
);

render(<Root />, document.getElementById('root'));

// Original code from create-react-app vvv

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './assets/styles/main.scss';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
