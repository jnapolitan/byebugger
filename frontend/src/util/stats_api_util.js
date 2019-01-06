import axios from 'axios';

export const getStats = () => {
    return axios.get('/api/stats');
};

export const postStat = data => {
    return axios.post('/api/stats/', data);
};