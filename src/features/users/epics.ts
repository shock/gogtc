import { Epic } from 'redux-observable'
import { from, of } from 'rxjs'
import { filter, switchMap, map, catchError, mergeMap } from 'rxjs/operators'
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions'

import { loginUserAsync, logoutUserAsync, createUserAsync } from './actions'
import { showAlert } from '../modals/actions'
import { clearCalculators } from '../form_calc/actions'
import User from '../../client_server/interfaces/User'
import { push } from 'connected-react-router'

export const loginUserEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(loginUserAsync.request)),
    // emits only loginUserAsync.request
    switchMap((action) =>
      from(api.users.loginUser(action.payload)).pipe(
        mergeMap((user:User) => of(
          showAlert('Login successful'),
          clearCalculators(),
          loginUserAsync.success(user),
          push('/'),
        )),
        catchError((message: string) => of(
          loginUserAsync.failure(message.toString()),
          showAlert(message, {variant: 'danger'})
        ))
      )
    )
  )

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
        mergeMap(() => of(
          clearCalculators(),
          logoutUserAsync.success(),
        )),
        catchError((message: string) => of(
          logoutUserAsync.failure(message.toString()),
          showAlert(message.toString(), {variant: 'danger'})
        ))
      )
    )
  )

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
        catchError((message: string) => {
          console.log('message: ' + message)
          return of(
            createUserAsync.failure(message.toString()),
            showAlert(message.toString(), {variant: 'danger'})
          )
        })
      )
    )
  )
