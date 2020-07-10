import { combineReducers } from 'redux'
import cuid from 'cuid'
import undoable, { excludeAction } from 'redux-undo'
import { createReducer, getType } from 'typesafe-actions'
import * as actions from './actions'
import { MFormCalc, FCState, BlankFCState, FormCalcDictionary } from './models'
import { getFormCalcId } from './lib/IdParser'

const createCopyName = (state:FCState, formCalc:MFormCalc) => {
  let copyName = formCalc.name+' - Copy'
  const formCalcsArray = Object.values(state.formCalcs) as [MFormCalc]
  const nameExists = (name:string, formCalcs:[MFormCalc]) => {
    return formCalcs.reduce((exists:boolean, fc:MFormCalc) => {
      exists = exists || fc.name === copyName
      return exists
    }, false)
  }
  while( nameExists(copyName, formCalcsArray) ) {
    copyName = copyName+'+'
  }
  return copyName
}

const getFormationById = (state:FCState, id: string) => {
  const formId = getFormCalcId(id)

  // NOTE: we have to clone the formCalc here, otherwise the UNDO history won't be preserved
  const formCalcModel = state.formCalcs[formId].clone()

  if( !(formCalcModel instanceof MFormCalc) )
    throw new Error(`Can't find formCalc with id: ${formId}`)
  return formCalcModel
}

const fcReturnState = (state:FCState, formCalc:MFormCalc, purgeId:string|undefined = undefined) => {
  const formCalcDictionary:FormCalcDictionary = {
    formCalcs: {...state.formCalcs}
  }
  if( purgeId ) {
    delete formCalcDictionary.formCalcs[purgeId]
  }
  formCalcDictionary.formCalcs[formCalc.id] = formCalc
  const returnState = {
    ...state,
    ...formCalcDictionary,
  }
  return returnState
}

const _formCalcReducer = createReducer(BlankFCState)
.handleAction(actions.copyFormCalc, (state, action) => {
  const currentFC = state.formCalcs[state.currentId]
  if( currentFC ) {
    const newFC = currentFC.clone()
    newFC.updateName(createCopyName(state, newFC))
    newFC.id = cuid()
    newFC.persisted = false
    newFC.preset = false
    const formCalcs = state.formCalcs
    formCalcs[newFC.id] = newFC
    return {
      ...state,
      formCalcs,
      currentId: newFC.id
    }
  } else {
    return state
  }
})
.handleAction(actions.loadUserCalcsAsync.success, (state, action) => {
    const formCalcs = action.payload
    console.log(formCalcs)
    const reducer = (fd:{[key: string]: MFormCalc}, fc:MFormCalc) => Object.assign(fd, { [fc.id]: fc } )
    const reduced = formCalcs.reduce(reducer, {} as {[key: string]: MFormCalc})
    let currentId = state.currentId
    if( !currentId ) {
      currentId = formCalcs[formCalcs.length-1]?.id
    }
    return ({
      ...state,
      currentId: currentId,
      formCalcs: {
        ...state.formCalcs,
        ...reduced
      }
    })
  })
  .handleAction(actions.createCalcAsync.success, (state, action) => {
    const { formCalc, oldId } = action.payload
    formCalc.clearChanged()
    formCalc.persisted = true
    return {
      ...fcReturnState(state, formCalc, oldId),
      currentId: formCalc.id
    }
  })
  .handleAction(actions.updateCalcAsync.success, (state, action) => {
    const formCalc = action.payload
    formCalc.clearChanged()
    formCalc.persisted = true
    return fcReturnState(state, formCalc)
  })
  .handleAction(actions.removeFromState, (state, action) => {
    const formCalcs = state.formCalcs
    delete formCalcs[action.payload.id]
    return {
      formCalcs,
      currentId: ''
    }
  })
  .handleAction(actions.deleteCalcAsync.success, (state, action) => {
    const formCalc = action.payload
    const formCalcs = state.formCalcs
    delete formCalcs[formCalc.id]
    return {
      ...state,
      formCalcs,
      currentId: ''
    }
  })
  .handleAction(actions.setFcId, (state, action) => {
    return {
      ...state,
      currentId: action.payload.id
    }
  })
  .handleAction(actions.clearCalculators, (state, action) => {
    return BlankFCState
  })
  .handleAction(actions.updateName, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateNameHandler(action.payload))
  })
  .handleAction(actions.updatePresetFlag, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updatePresetFlagHandler(action.payload))
  })
  .handleAction(actions.updateTroopCount, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTroopCountHandler(action.payload))
  })
  .handleAction(actions.updateTroopPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTroopPercentHandler(action.payload))
  })
  .handleAction(actions.updateTroopCountLock, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTroopCountLockHandler(action.payload))
  })
  .handleAction(actions.updateTierPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTierPercentHandler(action.payload))
  })
  .handleAction(actions.updateTierCapacityLock, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateTierCapacityLockHandler(action.payload))
  })
  .handleAction(actions.updateMarchCap, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).updateMarchCapHandler(action.payload))
  })
  .handleAction(actions.fixTroopPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).fixTroopPercentHandler(action.payload))
  })
  .handleAction(actions.fixTierPercent, (state, action) => {
    return fcReturnState(state, getFormationById(state, action.payload.id).fixTierPercentHandler(action.payload))
  })
  .handleAction(actions.resetState, (state, action) => {
    return fcReturnState(state, action.payload.formCalc)
  })



const parseActions = (rawActions:string[] | string, defaultValue=[]):string[] => {
  if (Array.isArray(rawActions)) {
    return rawActions
  } else if (typeof rawActions === 'string') {
    return [rawActions]
  }
  return defaultValue
}

const groupByActionTypeAndId = (rawActions:string[] | string) => {
  const actions = parseActions(rawActions)
  return (action:any) =>  {
    if(actions.indexOf(action.type) >= 0)
      return action.type+action.payload.id
    else
      return null
  }

}

const formCalcReducer = undoable(_formCalcReducer, {
  filter: excludeAction([getType(actions.resetState)]),
  groupBy: groupByActionTypeAndId(
    [actions.updateMarchCap, actions.updateTroopCount,
      actions.updateTroopPercent, actions.updateTierPercent,
      actions.fixTierPercent, actions.fixTroopPercent]
      .map( a => { return getType(a)} )
  )
})

export const isCreatingCalc = createReducer(false as boolean)
  .handleAction(actions.createCalcAsync.request, (state, action) => ( true ))
  .handleAction([actions.createCalcAsync.success,actions.createCalcAsync.failure], (state, action) => ( false ))

export const isLoadingUserCalcs = createReducer(false as boolean)
  .handleAction(actions.loadUserCalcsAsync.request, (state, action) => ( true ))
  .handleAction([actions.loadUserCalcsAsync.success,actions.loadUserCalcsAsync.failure], (state, action) => ( false ))

export const isUpdatingCalc = createReducer(false as boolean)
  .handleAction(actions.updateCalcAsync.request, (state, action) => ( true ))
  .handleAction([actions.updateCalcAsync.success,actions.updateCalcAsync.failure], (state, action) => ( false ))

export const isDeletingCalc = createReducer(false as boolean)
  .handleAction(actions.deleteCalcAsync.request, (state, action) => ( true ))
  .handleAction([actions.deleteCalcAsync.success,actions.deleteCalcAsync.failure], (state, action) => ( false ))

const formCalcReducers = combineReducers({
  formCalcs: formCalcReducer,
  isCreatingCalc,
  isLoadingUserCalcs,
  isUpdatingCalc,
  isDeletingCalc
})

export default formCalcReducers
export type FormCalcState = ReturnType<typeof formCalcReducers>