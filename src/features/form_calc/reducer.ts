import { KeyedNumEntry, FormCalc } from 'FormCalc';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { updateNumEntry, resetState } from './actions';
import store from '../../store';

export const initialState:FormCalc = {
  numEntries: {
    '1' : {
      id: '1',
      value: '1',
      label: 'Infantry'
    },
    '2' : {
      id: '2',
      value: '1',
      label: 'Cavalry'
    },
    '3' : {
      id: '3',
      value: '1',
      label: 'Distance'
    }
  }
};

const formCalc = createReducer(initialState)
  .handleAction(updateNumEntry, (state, action) => {
    const id = action.payload.id;

    const numEntry = state.numEntries[id];
    numEntry.value = action.payload.value;
    const update:KeyedNumEntry = {};
    update[id] = numEntry;
    const returnState =  {
      ...state,
      numEntries : Object.assign({}, state.numEntries, update)
    };
    return returnState;
  })
  .handleAction(resetState, (state, action) => {
    return {
      ...action.payload
    }
  });

const formCalcReducer = combineReducers({
  formCalc
});

export default formCalcReducer;
export type FormCalcState = ReturnType<typeof formCalcReducer>;

// const newState:FormCalc = {
//   numEntries: {
//     '1' : {
//       id: '1',
//       value: '1',
//       label: 'Infantry'
//     },
//     '2' : {
//       id: '2',
//       value: '1',
//       label: 'Cavalry'
//     },
//     '3' : {
//       id: '3',
//       value: '1',
//       label: 'Distance'
//     }
//   }
// };

// setTimeout( () => {
//   store.dispatch(resetState(newState));
// }, 1000);