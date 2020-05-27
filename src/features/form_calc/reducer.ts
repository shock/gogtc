import { KeyedNumEntry, FormCalc } from 'FormCalc';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { updateNumEntry, resetState } from './actions';

const initialState:FormCalc = {
  numEntries: {}
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