import { createAction } from 'typesafe-actions';
import { TitleBody, Alert, Variant } from './types'

export const showGeneralModal = createAction('SHOW_G_MODAL', (title: string, body: string) => ({
  title: title,
  body: body
}))<TitleBody>();

export const hideGeneralModal = createAction('HIDE_G_MODAL', () => {})<void>()

let alertId = 0;

export const createAlert = (message: string, variant:Variant='success') => ({
  id: alertId++,
  message: message,
  variant: variant
})

export const addAlert = createAction('ADD_ALERT', createAlert)<Alert>();
export const showAlert = addAlert

export const removeAlert = createAction('REMOVE_ALERT', (id:number) => {
  return {
    id: id
  }
})<{id:number}>();
