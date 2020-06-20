import { routerActions } from 'react-router-redux';
import * as todosActions from '../features/todos/actions';
import * as formCalcActions from '../features/form_calc/actions';
import * as userActions from '../features/users/actions';

export default {
  router: routerActions,
  todos: todosActions,
  formCalc: formCalcActions,
  users: userActions
};
