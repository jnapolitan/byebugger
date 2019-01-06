import {
    RECEIVE_STATS,
    RECEIVE_NEW_STAT
} from '../actions/stat_actions';

const statsReducer = (state = { all: {}, player: {} }, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);

    switch(action.type) {
        case RECEIVE_STATS:
            newState.all = action.stats.data;
            return newState;
        case RECEIVE_NEW_STAT:
            newState.player = action.stat.data;
            return newState;
        default:
            return state;
            
    }
};

export default statsReducer;
