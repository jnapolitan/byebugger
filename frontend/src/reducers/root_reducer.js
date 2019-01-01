import { combineReducers } from 'redux';
import session from './session_reducer';
import errorsReducer from './errors_reducer';
import statsReducer from './stats_reducer';

const RootReducer = combineReducers({
  session,
  errors: errorsReducer,
  stats: statsReducer
});

export default RootReducer;
