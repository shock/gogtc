import { combineReducers } from 'redux';
import fieldReducer from './field_reducer';

export default combineReducers({
  field: fieldReducer
});
