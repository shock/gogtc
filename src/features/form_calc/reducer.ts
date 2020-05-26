import { NumEntry, KeyedNumEntry, FormCalc } from 'FormCalc';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { incNumEntry, decNumEntry, updateNumEntry } from './actions';

const initialState:FormCalc = {
  numEntries: {
    '1' : {
      id: '1',
      value: '1'
    }
  }
};

const formCalc = createReducer(initialState)
  .handleAction(incNumEntry, (state, action) => {
    const id = action.payload.id;
    const numEntry = state.numEntries[id];
    let val = parseInt(numEntry.value);
    val = val + 1;
    numEntry.value = '' + val;
    const update:KeyedNumEntry = {};
    update[id] = numEntry;
    return {
      ...state,
      numEntries : Object.assign({}, state.numEntries, update)
    };
  })
  .handleAction(decNumEntry, (state, action) => {
    const id = action.payload.id;
    const numEntry = state.numEntries[id];
    let val = parseInt(numEntry.value);
    val = val - 1;
    numEntry.value = '' + val;
    const update:KeyedNumEntry = {};
    update[id] = numEntry;
    return {
      ...state,
      numEntries : Object.assign({}, state.numEntries, update)
    };
  })
  .handleAction(updateNumEntry, (state, action) => {
    const id = action.payload.id;
    const numEntry:NumEntry = {
      id: id,
      value: action.payload.value
    }
    const update:KeyedNumEntry = {};
    update[id] = numEntry;
    const returnState =  {
      ...state,
      numEntries : Object.assign({}, state.numEntries, update)
    };
    return returnState;
  })

const formCalcReducer = combineReducers({
  formCalc
});

export default formCalcReducer;
export type FormCalcState = ReturnType<typeof formCalcReducer>;
