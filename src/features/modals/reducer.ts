import { combineReducers } from 'redux'
import { createReducer, getType } from 'typesafe-actions';
import * as actions from './actions';

const initialState = {
  generalModal: {
    show: true,
    title: 'Info',
    body: 'Some body text'
  }
}

const modals = createReducer(initialState)
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

const modalsReducer = combineReducers({
  modals
})

export default modalsReducer
export type ModalsState = ReturnType<typeof modalsReducer>