import { Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { filter, switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RootAction, RootState, Services, isActionOf } from 'typesafe-actions';
import { ActionCreators as Undoable } from 'redux-undo'

import { createCalcAsync, updateCalcAsync, loadUserCalcsAsync } from './actions';
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
          showAlert('Formation Saved'),
          createCalcAsync.success(formCalc),
          Undoable.clearHistory()
        )),
        catchError((error: any) => of(
          showAlert('Failed to save formation', {variant: 'danger', details: error.toString()}),
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
        mergeMap((formCalc:MFormCalc) => of(
          showAlert('Formation Saved'),
          updateCalcAsync.success(formCalc),
          Undoable.clearHistory()
        )),
        catchError((error: any) => of(
          showAlert('Failed to save formation', {variant: 'danger', details: error.toString()}),
          updateCalcAsync.failure(error.toString()))
        )
      )
    )
  );

export const loadUserCalcsEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Services
> = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(loadUserCalcsAsync.request)),
    switchMap((action) =>
      from(api.formCalcs.getUserCalcs()).pipe(
        mergeMap((formCalcs:[MFormCalc]) => of(
          // showAlert('Formation Saved'),
          loadUserCalcsAsync.success(formCalcs),
          // Undoable.clearHistory()
        )),
        catchError((error: any) => of(
          showAlert('Failed to load formations', {variant: 'danger', details: error.toString()}),
          loadUserCalcsAsync.failure(error.toString()))
        )
      )
    )
  );
