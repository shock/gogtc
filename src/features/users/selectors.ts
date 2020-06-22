// import { createSelector } from 'reselect';

import { UsersState } from './reducer';

export const getUsers = (state: UsersState) => state.users;
