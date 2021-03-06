import {
    getStats,
    postStat
} from '../util/stats_api_util';

export const RECEIVE_STATS = 'RECEIVE_STATS';
export const RECEIVE_NEW_STAT = 'RECEIVE_NEW_STAT';

export const receiveStats = stats => ({
    type: RECEIVE_STATS,
    stats
});

export const receiveNewStat = stat => ({
    type: RECEIVE_NEW_STAT,
    stat
});

export const fetchStats = () => dispatch => (
    getStats()
        .then(stats => dispatch(receiveStats(stats)))
        .catch(err => console.log(err))
);

export const postPlayerStat = stat => dispatch => (
    postStat(stat)
        .then(stat => dispatch(receiveNewStat(stat.score)))
        .catch(err => console.log(err))
);
