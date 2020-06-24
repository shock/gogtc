import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';

import { loginUserAsync, logoutUserAsync, createUserAsync } from './actions';
import User from '../../client_server/interfaces/User'
import history from '../../lib/history'

const dothatSuccessThang = (payload:User) => {
  history.push('/')
  return loginUserAsync.success(payload)
}

export const loginUserEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(loginUserAsync.request)),
    switchMap((action) =>
      from(api.users.loginUser(action.payload)).pipe(
        map(dothatSuccessThang),
        catchError((message: string) => of(loginUserAsync.failure(message)))
      )
    )
  );

export const logoutUserEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(logoutUserAsync.request)),
    switchMap((action) =>
      from(api.users.logoutUser()).pipe(
        map(logoutUserAsync.success),
        catchError((message: string) => of(logoutUserAsync.failure(message)))
      )
    )
  );

export const createUserEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(createUserAsync.request)),
    switchMap((action) =>
      from(api.users.createUser(action.payload)).pipe(
        map(createUserAsync.success),
        catchError((message: string) => of(createUserAsync.failure(message)))
      )
    )
  );
