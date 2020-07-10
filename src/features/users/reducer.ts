import { combineReducers } from 'redux'
import { createReducer } from 'typesafe-actions'
import { setCurrentUser, clearCurrentUser, currentUser } from '../../lib/user'
import * as actions from './actions'
import User from '../../client_server/interfaces/User'

const { loginUserAsync, logoutUserAsync, createUserAsync } = actions

export const isLoggingIn = createReducer(false as boolean)
  .handleAction(loginUserAsync.request, (state, action) => ( true ))
  .handleAction([loginUserAsync.success,loginUserAsync.failure], (state, action) => ( false ))

export const isRegistering = createReducer(false as boolean)
  .handleAction(createUserAsync.request, (state, action) => ( true ))
  .handleAction([createUserAsync.success,createUserAsync.failure], (state, action) => ( false ))

const initialState = {
  currentUser: currentUser(),
  users: [] as User[]
}

export const users = createReducer(initialState)
  .handleAction(loginUserAsync.success, (state, action) => {
    setCurrentUser(action.payload)
    return {
      ...state,
      currentUser: currentUser()
    }
  })
  .handleAction(logoutUserAsync.success, (state, action) => {
    clearCurrentUser()
    return {
      ...state,
      currentUser: undefined
    }
  })
  .handleAction(createUserAsync.success, (state, action) => (state))

const usersReducer = combineReducers({
  isLoggingIn,
  isRegistering,
  users,
})

export default usersReducer
export type UsersState = ReturnType<typeof usersReducer>
