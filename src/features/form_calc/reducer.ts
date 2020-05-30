import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { updateNumEntry, resetState } from './actions';
import { TestLibrary, MFormCalc, BlankFCState } from './models';
import { getFormCalcName } from './models/IdParser';

const formCalc = createReducer(BlankFCState)
  .handleAction(updateNumEntry, (state, action) => {
    const id = action.payload.id;

    const formationName = getFormCalcName(id);
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