import { combineReducers } from 'redux'
import { createReducer, getType } from 'typesafe-actions';
import * as actions from './actions';
import { Alert } from './types'

const gmInitialState = {
  generalModal: {
    show: false,
    title: 'Info',
    body: 'Some body text'
  }
}

const modals = createReducer(gmInitialState)
  .handleAction(actions.showGeneralModal, (state, action) => {
    return {
      ...state,
      generalModal: {
        show: true,
        title: action.payload.title,
        body: action.payload.body
      }
    }
  })
  .handleAction(actions.hideGeneralModal, (state, action) => {
    return {
      ...state,
      generalModal: {
        show:false,
        title: 'Info',
        body: ''
      }
    }
  })

const alertsInitialState = {
  alerts: [] as Alert[]
}

const alerts = createReducer(alertsInitialState)
  .handleAction(actions.addAlert, (state, action) => {
    const alerts = state.alerts
    alerts.push(action.payload)
    return {
      ...state,
      alerts: alerts
    }
  })
  .handleAction(actions.removeAlert, (state, action) => {
    return {
      ...state,
      alerts: state.alerts.filter((alert) => (alert.id !== action.payload.id))
    }
  })

const modalsReducer = combineReducers({
  modals,
  alerts
})

export default modalsReducer
export type ModalsState = ReturnType<typeof modalsReducer>