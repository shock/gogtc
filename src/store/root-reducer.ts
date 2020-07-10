import { combineReducers } from 'redux'

import formCalcReducer from '../features/form_calc/reducer'
import usersReducer from '../features/users/reducer'
import modalsReducer from '../features/modals/reducer'
import settingsReducer from '../features/settings/reducer'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import history from '../lib/history'

const createRootReducer = (history:History) => combineReducers({
  router: connectRouter(history),
  users: usersReducer,
  formCalc: formCalcReducer,
  modals: modalsReducer,
  settings: settingsReducer
})

export default createRootReducer(history)
