import { IdValue, IdBoolean } from './types';
import { createAction } from 'typesafe-actions';
import { FCState } from './models';

export const updateTroopCount = createAction('UPDATE_TROOP_COUNT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdValue>();

export const updateTroopPercent = createAction('UPDATE_TROOP_PERCENT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdValue>();

export const updateTierCap = createAction('UPDATE_TIER_CAP', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdValue>();

export const updateTierPercent = createAction('UPDATE_TIER_PERCENT', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdValue>();

export const updateMarchCap = createAction('UPDATE_MARCH_CAP', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdValue>();

export const updateTierPercentLock = createAction('UPDATE_TIER_PERCENT_LOCK', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>();

export const updateTierCapacityLock = createAction('UPDATE_TIER_CAPCITY_LOCK', (id: string, boolean: boolean) => ({
  id: id,
  boolean: boolean
}))<IdBoolean>();

export type UpdateIdValueAction = typeof updateTroopCount | typeof updateTroopPercent |
  typeof updateMarchCap | typeof updateTierCap | typeof updateTierPercent;

export type UpdateIdBooleanAction = typeof updateTierPercentLock | typeof updateTierCapacityLock;

export const resetState = createAction('RESET_STATE', (state:FCState) => ({
  ...state
}))<FCState>();
