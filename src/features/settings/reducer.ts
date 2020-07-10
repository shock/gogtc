import { combineReducers } from 'redux'
import { createReducer } from 'typesafe-actions'
import * as actions from './actions'
import { MSettings } from './models'
import { toInt } from '../../lib/fixed-point'
import { TierNum } from '../../lib/fc-types'

const initialState:MSettings = {
  marchCap: toInt(0),
  highestTier: TierNum.T12,
  debug: false,
  calcView: 'calculator'
}

const settings = createReducer(initialState)
.handleAction(actions.updateUserMarchCap, (state, value) => {
  return {
    ...state,
    marchCap: toInt(value)
  }
})

const settingsReducers = combineReducers({
  settings
})

export default settingsReducers
export type SettingsState = ReturnType<typeof settingsReducers>