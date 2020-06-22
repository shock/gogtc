import { combineEpics, Epic } from 'redux-observable';

import { loadTodosEpic, saveTodosEpic } from '../features/todos/epics';
import { loginUserEpic } from '../features/users/epics';

export default combineEpics(
  loadTodosEpic,
  saveTodosEpic,
  loginUserEpic
);
