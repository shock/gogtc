import undoable, { excludeAction } from 'redux-undo';
import { createReducer, getType } from 'typesafe-actions';
import * as actions from './actions';
import { MFormCalc, FCState, BlankFCState, FormCalcDictionary } from './models';
import { getFormCalcName } from './lib/IdParser';

const getFormationById = (state:FCState, id: string) => {
  const formationName = getFormCalcName(id);

  // NOTE: we have to clone the formCalc here, otherwise the UNDO history won't be preserved
  const formCalcModel = state.formCalcs[formationName].clone();

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
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTroopCountHandler(action.payload));
  })
  .handleAction(actions.updateTroopPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTroopPercentHandler(action.payload));
  })
  .handleAction(actions.updateTroopCountLock, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTroopCountLockHandler(action.payload));
  })
  .handleAction(actions.updateTierPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTierPercentHandler(action.payload));
  })
  .handleAction(actions.updateTierCapacityLock, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTierCapacityLockHandler(action.payload));
  })
  .handleAction(actions.updateMarchCap, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateMarchCapHandler(action.payload));
  })
  .handleAction(actions.fixTroopPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).fixTroopPercentHandler(action.payload));
  })
  .handleAction(actions.fixTierPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).fixTierPercentHandler(action.payload));
  })
  .handleAction(actions.resetState, (state, action) => {
    return fcReturnState(state, action.payload.formCalc);
  });


const parseActions = (rawActions:string[] | string, defaultValue=[]):string[] => {
  if (Array.isArray(rawActions)) {
    return rawActions
  } else if (typeof rawActions === 'string') {
    return [rawActions]
  }
  return defaultValue
}

const groupByActionTypeAndId = (rawActions:string[] | string) => {
  const actions = parseActions(rawActions);
  return (action:any) =>  {
    if(actions.indexOf(action.type) >= 0)
      return action.type+action.payload.id
    else
      return null
  }

}

const formCalcReducer = undoable(formCalc, {
  filter: excludeAction([getType(actions.resetState)]),
  groupBy: groupByActionTypeAndId(
    [actions.updateMarchCap, actions.updateTroopCount,
      actions.updateTroopPercent, actions.updateTierPercent,
      actions.fixTierPercent, actions.fixTroopPercent]
      .map( a => { return getType(a)} )
  )
})
export default formCalcReducer;
export type FormCalcState = ReturnType<typeof formCalcReducer>;