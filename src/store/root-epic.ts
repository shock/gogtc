import { combineEpics, Epic } from 'redux-observable';

import { loginUserEpic, logoutUserEpic, createUserEpic } from '../features/users/epics';

export default combineEpics(
  loginUserEpic,
  logoutUserEpic,
  createUserEpic
);
