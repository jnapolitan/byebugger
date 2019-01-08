import {
    RECEIVE_STATS,
    RECEIVE_NEW_STAT
} from '../actions/stat_actions';

const statsReducer = (state = { topTenScores: [], currentPlayerScore: 0 }, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);

    switch(action.type) {
        case RECEIVE_STATS:
            newState.topTenScores = action.stats.data;
            return newState;
        case RECEIVE_NEW_STAT:
            newState.currentPlayerScore = action.stat;
            return newState;
        default:
            return state;
            
    }
};

export default statsReducer;
