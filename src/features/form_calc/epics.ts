import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';

import { createCalcAsync, updateCalcAsync } from './actions';
import { showAlert } from '../modals/actions'
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
        mergeMap((formCalc:MFormCalc) => of(
          showAlert('Save successful', 'success', 1000),
          createCalcAsync.success(formCalc)
        )),
        catchError((error: any) => of(
          showAlert('Failed to save', 'danger', 1000),
          createCalcAsync.failure(error.toString()))
        )
      )
    )
  );

export const updateCalcEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(updateCalcAsync.request)),
    switchMap((action) =>
      from(api.formCalcs.update(action.payload)).pipe(
        map(updateCalcAsync.success),
        catchError((error: any) => of(updateCalcAsync.failure(error.toString())))
      )
    )
  );
