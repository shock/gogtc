import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError, mergeMap, delay, tap } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';
import config from '../../config'
import { showAlert, addAlert, removeAlert } from './actions';
import User from '../../client_server/interfaces/User'
import { push } from 'connected-react-router'

export const showAlertEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(addAlert)),
    tap(it => console.log('tap1: '+it)),
    mergeMap((action) =>
      of(action.payload.id).pipe(
        delay(config.alertTimeout),
        tap(it => console.log('tap2: '+it)),
        map(removeAlert)
      )
    )
  );
