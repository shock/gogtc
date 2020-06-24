import { combineReducers } from 'redux';

import todosReducer from '../features/todos/reducer';
import formCalcReducer from '../features/form_calc/reducer';
import usersReducer from '../features/users/reducer'
import { connectRouter } from 'connected-react-router'
import { History } from 'history'
import history from '../lib/history'

const createRootReducer = (history:History) => combineReducers({
  router: connectRouter(history),
  todos: todosReducer,
  users: usersReducer,
  formCalc: formCalcReducer
})

export default createRootReducer(history)
