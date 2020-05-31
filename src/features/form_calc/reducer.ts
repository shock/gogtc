import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';

import { resetState, updateTroopCount } from './actions';
import { TestLibrary, MFormCalc, BlankFCState } from './models';
import { getFormCalcName } from './models/IdParser';

const getFormationById = (id: string) => {
  const formationName = getFormCalcName(id);
  const formCalcModel = TestLibrary.formCalcs[formationName];
  if( !(formCalcModel instanceof MFormCalc) )
    throw new Error(`Can't find formation with name: ${formationName}`);
  return formCalcModel;
}

const formCalc = createReducer(BlankFCState)
  .handleAction(updateTroopCount, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
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