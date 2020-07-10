import { Epic } from 'redux-observable'
import { of } from 'rxjs'
import { filter, map, mergeMap, delay } from 'rxjs/operators'
import { RootAction, RootState, isActionOf } from 'typesafe-actions'
import config from '../../config'
import { showAlert, hideAlert } from './actions'

export const showAlertEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(showAlert)),
    mergeMap((action) =>
      of(action.payload.id).pipe(
        delay(action.payload.timeout || config.alertTimeout),
        map(hideAlert)
      )
    )
  )
