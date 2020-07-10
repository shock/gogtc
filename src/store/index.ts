import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { RootAction, RootState, Services } from 'typesafe-actions'
import { routerMiddleware } from 'connected-react-router'
import history from '../lib/history'

import { composeEnhancers } from './utils'
import rootReducer from './root-reducer'
import rootEpic from './root-epic'
import services from '../services'

export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Services
>({
  dependencies: services,
})

// configure middlewares
const middlewares = [
  epicMiddleware,
  routerMiddleware(history)
]
// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares))

// rehydrate state on app start
const initialState = {}

// create store
const store = createStore(rootReducer, initialState, enhancer)

epicMiddleware.run(rootEpic)

// export store singleton instance
export default store
