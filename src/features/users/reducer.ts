import { combineReducers } from 'redux'
import { createReducer } from 'typesafe-actions'

import * as actions from './actions'
import User from './models/MUser'

const { request, success, failure } = actions.loginUserAsync;

export const isLoggingIn = createReducer(false as boolean)
  .handleAction(request, (state, action) => ( true ))
  .handleAction([success,failure], (state, action) => ( false ))

const initialState = {
  users: [] as User[]
}

export const users = createReducer(initialState)
  .handleAction(success, (state, action) => (
    {
      ...state
    }
  ))

const usersReducer = combineReducers({
  isLoggingIn,
  users,
});

export default usersReducer
export type UsersState = ReturnType<typeof usersReducer>
