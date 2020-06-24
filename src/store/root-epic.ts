import { combineEpics, Epic } from 'redux-observable';

import { loadTodosEpic, saveTodosEpic } from '../features/todos/epics';
import { loginUserEpic, logoutUserEpic, createUserEpic } from '../features/users/epics';

export default combineEpics(
  loadTodosEpic,
  saveTodosEpic,
  loginUserEpic,
  logoutUserEpic,
  createUserEpic
);
