import { IdString, IdBoolean, IdOnly } from './types';
import { createAction } from 'typesafe-actions';
import { FCState } from './models';

export const updateTroopCount = createAction('UPDATE_TROOP_COUNT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>();

export const updateTroopPercent = createAction('UPDATE_TROOP_PERCENT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>();

export const updateTierPercent = createAction('UPDATE_TIER_PERCENT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>();

export const updateMarchCap = createAction('UPDATE_MARCH_CAP', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdString>();

export const updateTierCapacityLock = createAction('UPDATE_TIER_CAPCITY_LOCK', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>();

export const updateTroopCountLock = createAction('UPDATE_TROOP_COUNT_LOCK', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>();

export const toggleFormCalcDebug = createAction('TOGGLE_FC_DEBUG', (id: string) => ({
  id: id
}))<IdBoolean>();

export const fixTroopPercent = createAction('FIX_TROOP_PERCENT', (id:string) => ({
  id: id
}))<IdOnly>();

export const fixTierPercent = createAction('FIX_TIER_PERCENT', (id:string) => ({
  id: id
}))<IdOnly>();

export type UpdateIdValueAction = typeof updateTroopCount | typeof updateTroopPercent |
  typeof updateMarchCap | typeof updateTierPercent;

export type UpdateIdBooleanAction = typeof updateTierCapacityLock | typeof updateTroopCountLock;

export type IdOnlyAction = typeof fixTroopPercent | typeof fixTierPercent | typeof toggleFormCalcDebug;

export const resetState = createAction('RESET_STATE', (state:FCState) => ({
  ...state
}))<FCState>();
