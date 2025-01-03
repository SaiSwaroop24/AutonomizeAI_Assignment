import React, { useState } from 'react';
import { saveUser, fetchRepos } from '../api';

const Search = ({ setRepos, setUserInfo }) => {
    const [username, setUsername] = useState('');

    const handleSearch = async () => {
        try {
            const user = await saveUser(username);
            const repos = await fetchRepos(username);
            setUserInfo(user.data);
            setRepos(repos.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default Search;
