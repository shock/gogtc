// tslint:disable no-import-side-effect
// tslint:disable no-submodule-imports
// This must be the first line in src/index.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'tslib';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// import './assets/styles/main.scss';
import Home from './routes/home';
import store from './store';
import './assets/styles/main.scss';

import { NumEntryWrapper } from './features/form_calc/components/num_entry_wrapper';

const styles: React.CSSProperties = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const Root = () => (
  <div style={styles}>
    <Provider store={store}>
      {/* <NumEntry key={'1'} id={'1'} value={'1'} label={'test'} /> */}
      <NumEntryWrapper />
    </Provider>
  </div>
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
