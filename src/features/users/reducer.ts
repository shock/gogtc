import { combineReducers } from 'redux'
import { createReducer } from 'typesafe-actions'

import * as actions from './actions'
import User from './models/MUser'

const { loginUserAsync, createUserAsync } = actions;

export const isLoggingIn = createReducer(false as boolean)
  .handleAction(loginUserAsync.request, (state, action) => ( true ))
  .handleAction([loginUserAsync.success,loginUserAsync.failure], (state, action) => ( false ))

export const isRegistering = createReducer(false as boolean)
  .handleAction(createUserAsync.request, (state, action) => ( true ))
  .handleAction([createUserAsync.success,createUserAsync.failure], (state, action) => ( false ))

const initialState = {
  users: [] as User[]
}

export const users = createReducer(initialState)
  .handleAction(loginUserAsync.success, (state, action) => (state))
  .handleAction(createUserAsync.success, (state, action) => (state))

const usersReducer = combineReducers({
  isLoggingIn,
  isRegistering,
  users,
});

export default usersReducer
export type UsersState = ReturnType<typeof usersReducer>
