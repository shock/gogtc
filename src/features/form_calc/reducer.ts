import { NumEntry } from 'FormCalc';
import { FormCalcState } from 'FormCalc';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { incNumEntry, decNumEntry, updateNumEntry } from './actions';

const initialState:FormCalcState = {};

export const numEntries = createReducer(initialState)
  .handleAction(incNumEntry, (state, action) => {
    const id = action.payload.id;
    const numEntry = state[id];
    let val = parseInt(numEntry.value);
    val = val + 1;
    numEntry.value = '' + val;
    return {
      ...state,
      id: numEntry
    };
  })
  .handleAction(decNumEntry, (state, action) => {
    const id = action.payload.id;
    const numEntry = state[id];
    let val = parseInt(numEntry.value);
    val = val + 1;
    numEntry.value = '' + val;
    return {
      ...state,
      id: numEntry
    };
  })

const formCalcReducer = combineReducers({
  numEntries
});

export default formCalcReducer;