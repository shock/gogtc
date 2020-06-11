import { combineReducers } from 'redux';
import { createReducer } from 'typesafe-actions';
import * as actions from './actions';
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
  .handleAction(actions.updateTroopCount, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateTroopPercent, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateTroopCountLock, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateTroopPercentLock, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateTierPercent, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateTierCapacityLock, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateTierPercentLock, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.updateMarchCap, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.fixTroopPercent, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.fixTierPercent, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.toggleFormCalcDebug, (state, action) => {
    return getFormationById(action.payload.id).handleAction(state, action);
  })
  .handleAction(actions.resetState, (state, action) => {
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