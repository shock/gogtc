import { NumEntry } from 'FormCalc';
import { createAction } from 'typesafe-actions';
import { FormCalc } from 'FormCalc';

export const updateNumEntry = createAction('UPDATE_NUM_ENTRY', (id: string, value: string) => ({
  id: id,
  value: value
}))<NumEntry>();
export const resetState = createAction('RESET_STATE', (state:FormCalc) => ({
  ...state
}))<FormCalc>();

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
