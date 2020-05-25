import { NumEntry } from 'FormCalc';
import cuid from 'cuid';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const incNumEntry = createAction('INC_NUM_ENTRY', (id: string) => ({
  id: id,
}))<NumEntry>();

export const decNumEntry = createAction('DEC_NUM_ENTRY', (id: string) => ({
  id: id,
}))<NumEntry>();

export const updateNumEntry = createAction('DEC_NUM_ENTRY', (id: string, value: string) => ({
  id: id,
}))<NumEntry>();

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
