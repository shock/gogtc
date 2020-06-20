import { combineEpics } from 'redux-observable';

import * as todosEpics from '../features/todos/epics';
import * as usersEpics from '../features/users/epics';

export default combineEpics(todosEpics, usersEpics);
