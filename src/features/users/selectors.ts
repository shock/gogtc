import { UsersState } from './reducer'

export const currentUser = (state: UsersState) => state.users.currentUser
export const getUsers = (state: UsersState) => state.users.users
