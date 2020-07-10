import { createAsyncAction, createAction } from 'typesafe-actions'
import { IdString, IdBoolean, IdOnly } from '../../lib/action_types'
import { MFormCalc } from './models'

export type IdFormCalc = {
  id: string,
  formCalc: MFormCalc
}

export const saveFormCalc = (formCalc:MFormCalc) => {
  if(!formCalc.persisted) {
    return createCalcAsync.request(formCalc)
  } else {
    return updateCalcAsync.request(formCalc)
  }
}

export const deleteFormCalc = (formCalc:MFormCalc) => {
  if(formCalc.persisted) {
    return deleteCalcAsync.request(formCalc)
  } else {
    return removeFromState(formCalc.id)
  }
}

export const createCalcAsync = createAsyncAction(
  'CREATE_CALC_REQUEST',
  'CREATE_CALC_SUCCESS',
  'CREATE_CALC_FAILURE'
)<MFormCalc, { formCalc: MFormCalc, oldId: string }, string>()

export const updateCalcAsync = createAsyncAction(
  'UPDATE_CALC_REQUEST',
  'UPDATE_CALC_SUCCESS',
  'UPDATE_CALC_FAILURE'
)<MFormCalc, MFormCalc, string>()

export const deleteCalcAsync = createAsyncAction(
  'DELETE_CALC_REQUEST',
  'DELETE_CALC_SUCCESS',
  'DELETE_CALC_FAILURE'
)<MFormCalc, MFormCalc, string>()

export const loadUserCalcsAsync = createAsyncAction(
  'LOAD_USER_CALCS_REQUEST',
  'LOAD_USER_CALCS_SUCCESS',
  'LOAD_USER_CALCS_FAILURE'
)<undefined, [MFormCalc], string>()

export const setFcId = createAction('SET_FC_ID', (id:string) => ({
  id: id
}))<IdOnly>()

export const clearCalculators = createAction('CLEAR_CALCULATORS', () => {})<void>()

export const removeFromState = createAction('REMOVE_CALC_FROM_STATE', (id:string) => ({
  id: id
}))<IdOnly>()

export const updateName = createAction('UPDATE_NAME', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>()

export const updatePresetFlag = createAction('UPDATE_PRESET', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>()

export const updateTroopCount = createAction('UPDATE_TROOP_COUNT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>()

export const updateTroopPercent = createAction('UPDATE_TROOP_PERCENT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>()

export const updateTierPercent = createAction('UPDATE_TIER_PERCENT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>()

export const updateMarchCap = createAction('UPDATE_MARCH_CAP', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>()

export const updateTierCapacityLock = createAction('UPDATE_TIER_CAPCITY_LOCK', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>()

export const updateTroopCountLock = createAction('UPDATE_TROOP_COUNT_LOCK', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>()

export const fixTroopPercent = createAction('FIX_TROOP_PERCENT', (id:string) => ({
  id: id
}))<IdOnly>()

export const fixTierPercent = createAction('FIX_TIER_PERCENT', (id:string) => ({
  id: id
}))<IdOnly>()

export const copyFormCalc = createAction('COPY_FORM_CALC', (id:string) => ({
  id: id
}))<IdOnly>()

export type UpdateIdValueAction = typeof updateTroopCount | typeof updateTroopPercent |
  typeof updateMarchCap | typeof updateTierPercent

export type UpdateIdBooleanAction = typeof updateTierCapacityLock | typeof updateTroopCountLock

export type IdOnlyAction = typeof fixTroopPercent | typeof fixTierPercent

export const resetState = createAction('RESET_STATE', (id:string, formCalc:MFormCalc) => ({
  id: id,
  formCalc: formCalc
}))<IdFormCalc>()
