import { createAction } from 'typesafe-actions'
import { TitleBody, Alert } from './types'
import { BootstrapVariant } from '../../types'
import config from '../../config'

export const showGeneralModal = createAction('SHOW_G_MODAL', (body: string, title='Info') => ({
  title: title,
  body: body
}))<TitleBody>()

export const hideGeneralModal = createAction('HIDE_G_MODAL', () => {})<void>()

let alertId = 0

export type AlertOptions = {
  variant?:BootstrapVariant,
  timeout?:number,
  details?:string
}

const createAlert = (message: string, options:AlertOptions={}) => ({
  id: alertId++,
  message: message,
  variant: options.variant || 'success',
  timeout: options.timeout || config.alertTimeout,
  details: options.details
})

export const showAlert = createAction('ADD_ALERT', createAlert)<Alert>()

export const hideAlert = createAction('REMOVE_ALERT', (id:number) => {
  return {
    id: id
  }
})<{id:number}>()
