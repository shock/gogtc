import { combineEpics } from 'redux-observable'

import * as userEpics from '../features/users/epics'
import * as formCalcEpics from '../features/form_calc/epics'
import * as modalEpics from '../features/modals/epics'

export default combineEpics(
  ...[
    ...Object.values(userEpics),
    ...Object.values(formCalcEpics),
    ...Object.values(modalEpics),
  ]
)
