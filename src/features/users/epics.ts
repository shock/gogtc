import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';

import { loginUserAsync } from './actions';

export const loginUserEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(loginUserAsync.request)),
    switchMap((action) =>
      from(api.users.loginUser(action.payload.username, action.payload.password)).pipe(
        map(loginUserAsync.success),
        catchError((message: string) => of(loginUserAsync.failure(message)))
      )
    )
  );
