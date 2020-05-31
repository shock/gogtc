import { IdValue } from './types';
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

export const updateMarchCap = createAction('UPDATE_MARCH_CAP', (id: string, value: string) => ({
  id: id,
  value: value
}))<IdValue>();

export type UpdateIdValueAction = typeof updateTroopCount | typeof updateTroopPercent | typeof updateMarchCap;

export const resetState = createAction('RESET_STATE', (state:FCState) => ({
  ...state
}))<FCState>();
