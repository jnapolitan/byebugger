import {
  RECEIVE_CURRENT_HEALTH,
  RECEIVE_NEW_HEALTH
} from '../actions/health_actions';

const healthReducer = (state = 100, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CURRENT_HEALTH:
      return action.currentHealth;
    case RECEIVE_NEW_HEALTH:
      return action.newHealth;
    default:
      return state;
  }
};

export default healthReducer;