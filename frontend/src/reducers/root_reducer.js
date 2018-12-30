import { combineReducers } from 'redux';
import session from './session_reducer';
import errorsReducer from './errors_reducer';

const RootReducer = combineReducers({
  session,
  errors: errorsReducer
});

export default RootReducer;