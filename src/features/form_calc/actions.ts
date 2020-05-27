import { NumEntry, NumEntryDictionary } from './types';
import { createAction } from 'typesafe-actions';

export const updateNumEntry = createAction('UPDATE_NUM_ENTRY', (id: string, value: string) => ({
  id: id,
  value: value
}))<NumEntry>();
export const resetState = createAction('RESET_STATE', (state:NumEntryDictionary) => ({
  ...state
}))<NumEntryDictionary>();

// export const loadTodosAsync = createAsyncAction(
//   'LOAD_TODOS_REQUEST',
//   'LOAD_TODOS_SUCCESS',
//   'LOAD_TODOS_FAILURE'
// )<undefined, Todo[], string>();

// export const saveTodosAsync = createAsyncAction(
//   'SAVE_TODOS_REQUEST',
//   'SAVE_TODOS_SUCCESS',
//   'SAVE_TODOS_FAILURE'
// )<undefined, undefined, string>();
