import { NumEntry } from 'FormCalc';
import { FormCalc } from 'FormCalc';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { incNumEntry, decNumEntry, updateNumEntry } from './actions';

const initialState:FormCalc = {
  numEntries: {}
};

const formCalc = createReducer(initialState)
  .handleAction(incNumEntry, (state, action) => {
    const id = action.payload.id;
    const numEntry = state.numEntries[id];
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
    const numEntry = state.numEntries[id];
    let val = parseInt(numEntry.value);
    val = val + 1;
    numEntry.value = '' + val;
    return {
      ...state,
      id: numEntry
    };
  })

const formCalcReducer = combineReducers({
  formCalc
});

export default formCalcReducer;
export type FormCalcState = ReturnType<typeof formCalcReducer>;
