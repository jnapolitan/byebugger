import axios from 'axios';

export const getStats = () => {
    return axios.get('/api/stats');
};

export const getUserStats = id => {
    return axios.get(`/api/stats/user/${id}`);
};

export const postStat = data => {
    return axios.post('/api/stats/', data);
}