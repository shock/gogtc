import MUser from './models/MUser'
import { createAction, createAsyncAction } from 'typesafe-actions';

export const loginUser = createAction('LOGIN_USER', (login:string, password:string) => ({
  login: login,
  password: password
}))

export const loginUserAsync = createAsyncAction(
  'LOGIN_USER_REQUEST',
  'LOGIN_USER_SUCCESS',
  'LOGIN_USER_FAILURE'
)<undefined, undefined, string>();

export const createUserAsync = createAsyncAction(
  'CREATE_USER_REQUEST',
  'CREATE_USER_SUCCESS',
  'CREATE_USER_FAILURE'
)<undefined, undefined, string>();

export const loadUsersAsync = createAsyncAction(
  'LOAD_USERS_REQUEST',
  'LOAD_USERS_SUCCESS',
  'LOAD_USERS_FAILURE'
)<undefined, [MUser], string>();
