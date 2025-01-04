import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DatabaseManager() {
    const [searchField, setSearchField] = useState('username');
    const [searchValue, setSearchValue] = useState('');
    const [users, setUsers] = useState([]);
    const [updateField, setUpdateField] = useState('location');
    const [updateValue, setUpdateValue] = useState('');
    const [sortField, setSortField] = useState('public_repos');

    useEffect(() => {
        fetchSortedUsers();
    }, [sortField]);

    const fetchSortedUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users?sortBy=${sortField}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching sorted users:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?${searchField}=${searchValue}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

   

    const handleUpdate = async (username) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${username}`, { [updateField]: updateValue });
            fetchSortedUsers();
            alert('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Database Manager</h1>

            <div>
                <h3>Search Users</h3>
                <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                    <option value="username">Username</option>
                    <option value="details.location">Location</option>
                </select>
                <input
                    type="text"
                    placeholder={`Enter ${searchField}`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div>
                <h3>Update User</h3>
                <select value={updateField} onChange={(e) => setUpdateField(e.target.value)}>
                    <option value="location">Location</option>
                    <option value="blog">Blog</option>
                    <option value="bio">Bio</option>
                </select>
                <input
                    type="text"
                    placeholder={`Enter new ${updateField}`}
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                />
                <button onClick={() => handleUpdate(prompt('Enter username to update'))}>Update</button>
            </div>

            <div>
                <h3>Sort Users</h3>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="public_repos">Public Repos</option>
                    <option value="public_gists">Public Gists</option>
                    <option value="followers">Followers</option>
                    <option value="following">Following</option>
                    <option value="created_at">Created At</option>
                </select>
            </div>

            
        </div>
    );
}

export default DatabaseManager;
