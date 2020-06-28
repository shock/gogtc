import { createAction } from 'typesafe-actions';
import { TitleBody } from './types'

export const showGeneralModal = createAction('SHOW_G_MODAL', (title: string, body: string) => ({
  title: title,
  body: body
}))<TitleBody>();

export const hideGeneralModal = createAction('HIDE_G_MODAL', () => {})<void>()
