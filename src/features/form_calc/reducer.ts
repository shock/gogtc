import { KeyedNumEntry, NumEntryDictionary } from './types';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { updateNumEntry, resetState } from './actions';
import { TestLibrary, MFormCalc } from './models';

const initialState:NumEntryDictionary = {
  numEntries: {}
};

const formCalc = createReducer(initialState)
  .handleAction(updateNumEntry, (state, action) => {
    const id = action.payload.id;

    const formationName = id.split(':')[0];
    const formCalcModel = TestLibrary.formCalcModels[formationName];
    if( !(formCalcModel instanceof MFormCalc) )
      throw new Error(`Can't find formation with name: ${formationName}`);
    return formCalcModel.handleAction(action);

    // const numEntry = state.numEntries[id];
    // numEntry.value = action.payload.value;
    // const update:KeyedNumEntry = {};
    // update[id] = numEntry;
    // const returnState =  {
    //   ...state,
    //   numEntries : Object.assign({}, state.numEntries, update)
    // };
    // return returnState;
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