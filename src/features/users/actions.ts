import { createAction, createAsyncAction } from 'typesafe-actions';
import User from './models/MUser'
import { CreateUser } from '../../client_server/interfaces/User'

export const loginUser = (username: string, password:string) => (
  loginUserAsync.request({
    username,
    password
  })
)

export const createUser = (createUser:CreateUser) => (
  createUserAsync.request(createUser)
)

// export const logoutUser = createAction('LOGOUT_USER')
export const logoutUser = createAction('LOGOUT_USER')<void>();

export const loginUserAsync = createAsyncAction(
  'LOGIN_USER_REQUEST',
  'LOGIN_USER_SUCCESS',
  'LOGIN_USER_FAILURE'
)<({username:string, password:string}), undefined, string>();

export const createUserAsync = createAsyncAction(
  'CREATE_USER_REQUEST',
  'CREATE_USER_SUCCESS',
  'CREATE_USER_FAILURE'
)<CreateUser, User, string>();

export const loadUsersAsync = createAsyncAction(
  'LOAD_USERS_REQUEST',
  'LOAD_USERS_SUCCESS',
  'LOAD_USERS_FAILURE'
)<undefined, [User], string>();
