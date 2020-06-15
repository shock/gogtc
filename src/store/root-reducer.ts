import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import todosReducer from '../features/todos/reducer';
import formCalcReducer from '../features/form_calc/reducer';

const rootReducer = combineReducers({
  router: routerReducer,
  todos: todosReducer,
  formCalc: formCalcReducer
});

export default rootReducer;
