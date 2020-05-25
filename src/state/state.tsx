/*
  External Imports
*/

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import Big from 'big.js';

/*
  Internal Imports
*/

import { ApplicationState } from './state.types';
import rootReducer from './reducers';
import { UPDATE_NUM_ENTRY } from './actions/action_types';

const marchCap = new Big(1000);
const infantry = marchCap.div(3).round();
const distance = marchCap.times(2).div(3).round();

const initialState = {
  field: {
    value: {
      'march_cap': marchCap,
      'Infantry': infantry,
      'Distance': distance
    }
  }
};

const middleware = [thunk];

// TODO: NOTE: Enabling tracing has a performance penalty
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

export const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(...middleware),
  )
);

/*
  Example of Calling .dispatch directly on store
*/

// const marchCap = 1000;
// const payloads = [
//   {
//     id: 'march_cap',
//     value: marchCap
//   },
//   {
//     id: 'Infantry',
//     value: marchCap/2
//   },
//   {
//     id: 'Distance',
//     value: marchCap/2
//   },
// ];

// setTimeout(() => {
//   payloads.map( (payload) => {
//     store.dispatch({
//       type: UPDATE_NUM_ENTRY,
//       payload: payload
//     });
//     return payload;
//   });
// }, 500);
