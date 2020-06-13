import undoable, { excludeAction, groupByActionTypes } from 'redux-undo';
import { createReducer, getType } from 'typesafe-actions';
import * as actions from './actions';
import { TestLibrary, MFormCalc, FCState, BlankFCState, FormCalcDictionary } from './models';
import { getFormCalcName } from './models/IdParser';

const getFormationById = (id: string) => {
  const formationName = getFormCalcName(id);
  const formCalcModel = TestLibrary.formCalcs[formationName];
  if( !(formCalcModel instanceof MFormCalc) )
    throw new Error(`Can't find formation with name: ${formationName}`);
  return formCalcModel;
}

const fcReturnState = (state:FCState, formCalc:MFormCalc) => {
  const formCalcDictionary:FormCalcDictionary = {
    formCalcs: {...state.formCalcs}
  };
  formCalcDictionary.formCalcs[formCalc.name] = formCalc;
  const returnState = {
    ...state,
    ...formCalcDictionary,
  }
  return returnState;
};

const formCalc = createReducer(BlankFCState)
  .handleAction(actions.updateTroopCount, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).updateTroopCountHandler(action.payload));
  })
  .handleAction(actions.updateTroopPercent, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).updateTroopPercentHandler(action.payload));
  })
  .handleAction(actions.updateTroopCountLock, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).updateTroopCountLockHandler(action.payload));
  })
  .handleAction(actions.updateTierPercent, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).updateTierPercentHandler(action.payload));
  })
  .handleAction(actions.updateTierCapacityLock, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).updateTierCapacityLockHandler(action.payload));
  })
  .handleAction(actions.updateMarchCap, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).updateMarchCapHandler(action.payload));
  })
  .handleAction(actions.fixTroopPercent, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).fixTroopPercentHandler(action.payload));
  })
  .handleAction(actions.fixTierPercent, (state, action) => {
    return fcReturnState(state, getFormationById(action.payload.id).fixTierPercentHandler(action.payload));
  })
  .handleAction(actions.resetState, (state, action) => {
    return fcReturnState(state, action.payload.formCalc);
  });

const formCalcReducer = undoable(formCalc, {
  filter: excludeAction([]),
  groupBy: groupByActionTypes(
    [actions.updateMarchCap, actions.updateTroopCount,
      actions.updateTroopPercent, actions.updateTierPercent,
      actions.fixTierPercent, actions.fixTroopPercent]
      .map( a => { return getType(a)} )
  )
})
export default formCalcReducer;
export type FormCalcState = ReturnType<typeof formCalcReducer>;