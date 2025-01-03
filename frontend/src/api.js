import axios from 'axios';

// Define BASE_URL
const BASE_URL = 'https://api.github.com';

// Create Axios instance for consistent base URL usage
const API = axios.create({
    baseURL: `${BASE_URL}/users`,
});

// Backend API endpoints
export const saveUser = (username) => API.post('/save-user', { username });
export const fetchRepos = (username) => axios.get(`${BASE_URL}/users/${username}/repos`);
export const fetchFollowers = (username) => axios.get(`${BASE_URL}/users/${username}/followers`);
export const searchUsers = (query) => API.get(`/search?query=${query}`);
export const deleteUser = (username) => API.delete(`/delete-user/${username}`);
export const updateUser = (username, data) => API.put(`/update-user/${username}`, data);
export const fetchSortedUsers = (sortField) => API.get(`/list?sortField=${sortField}`);
export const fetchMutualFriends = (username) => API.post('/mutual-friends', { username });
export const fetchUser = async (username) => {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    return response;
};

// Functions for new features
export const fetchStars = (repoName) => {
    return axios.get(`${BASE_URL}/repos/${repoName}/stargazers`);
};

export const fetchFollowing = (username) => {
    return axios.get(`${BASE_URL}/users/${username}/following`);
};
