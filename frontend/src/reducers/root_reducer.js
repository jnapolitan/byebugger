import { combineReducers } from 'redux';
import statsReducer from './stats_reducer';

const RootReducer = combineReducers({
  stats: statsReducer
});

export default RootReducer;
