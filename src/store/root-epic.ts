import { combineEpics, Epic } from 'redux-observable';

import { loginUserEpic, logoutUserEpic, createUserEpic } from '../features/users/epics';
import { createCalcEpic, updateCalcEpic } from '../features/form_calc/epics';

export default combineEpics(
  loginUserEpic,
  logoutUserEpic,
  createUserEpic,
  createCalcEpic,
  updateCalcEpic
);
