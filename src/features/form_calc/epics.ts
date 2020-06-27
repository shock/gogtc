import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';

import { createCalcAsync } from './actions';
import { MFormCalc } from './models'
import history from '../../lib/history'
import { push } from 'connected-react-router'

export const createCalcEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(createCalcAsync.request)),
    switchMap((action) =>
      from(api.formCalcs.create(action.payload)).pipe(
        map(createCalcAsync.success),
        catchError((error: any) => of(createCalcAsync.failure(error.toString())))
      )
    )
  );
