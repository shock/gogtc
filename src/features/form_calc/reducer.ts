import { KeyedNumEntry, NumEntryDictionary } from './types';
import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import { FormCalcDictionary, TierDefDictionary, TroopDefDictionary } from './models';

import { updateNumEntry, resetState } from './actions';
import { TestLibrary, MFormCalc } from './models';

export type FCState = NumEntryDictionary & FormCalcDictionary & TierDefDictionary & TroopDefDictionary;

const numEntryState:FCState = {
  numEntries: {},
  formCalcs: {},
  tierDefs: {},
  troopDefs: {}
};

const formCalc = createReducer(numEntryState)
  .handleAction(updateNumEntry, (state, action) => {
    const id = action.payload.id;

    const formationName = new MFormCalc('dummy').getFormCalcName(id);
    const formCalcModel = TestLibrary.formCalcs[formationName];
    if( !(formCalcModel instanceof MFormCalc) )
      throw new Error(`Can't find formation with name: ${formationName}`);
    return formCalcModel.handleAction(state, action);

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
      ...state,
      ...action.payload
    }
  });

const formCalcReducer = combineReducers({
  formCalc
});

export default formCalcReducer;
export type FormCalcState = ReturnType<typeof formCalcReducer>;