import { combineReducers } from 'redux';
import statsReducer from './stats_reducer';
import healthReducer from './health_reducer';

const RootReducer = combineReducers({
  stats: statsReducer,
  health: healthReducer
});

export default RootReducer;
