import { createAsyncAction } from 'typesafe-actions'
import { User, LoginUser, CreateUser } from '../../client_server/interfaces/User'

export const loginUser = (loginUser:LoginUser) => (
  loginUserAsync.request(loginUser)
)

export const createUser = (createUser:CreateUser) => {
  return createUserAsync.request(createUser)
}

export const logoutUser = () => {
  return logoutUserAsync.request()
}

export const loginUserAsync = createAsyncAction(
  'LOGIN_USER_REQUEST',
  'LOGIN_USER_SUCCESS',
  'LOGIN_USER_FAILURE'
)<LoginUser, User, string>()

export const logoutUserAsync = createAsyncAction(
  'LOGOUT_USER_REQUEST',
  'LOGOUT_USER_SUCCESS',
  'LOGOUT_USER_FAILURE'
)<undefined, undefined, string>()

export const createUserAsync = createAsyncAction(
  'CREATE_USER_REQUEST',
  'CREATE_USER_SUCCESS',
  'CREATE_USER_FAILURE'
)<CreateUser, undefined, string>()

export const loadUsersAsync = createAsyncAction(
  'LOAD_USERS_REQUEST',
  'LOAD_USERS_SUCCESS',
  'LOAD_USERS_FAILURE'
)<undefined, [User], string>()
