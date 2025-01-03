import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/users',
});

// Backend API endpoints
export const saveUser = (username) => API.post('/save-user', { username });
export const fetchRepos = (username) => axios.get(`https://api.github.com/users/${username}/repos`);
export const fetchFollowers = (username) => axios.get(`https://api.github.com/users/${username}/followers`);
