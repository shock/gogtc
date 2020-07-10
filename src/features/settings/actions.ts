import { createAction } from 'typesafe-actions'

export const updateUserMarchCap = createAction('UPDATE_USER_MARCH_CAP', (value: string) => value)<string>()
