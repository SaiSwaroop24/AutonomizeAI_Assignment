import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatabaseManager from './DatabaseManage';

function App() {
    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);

    const handleSearch = async () => {
        try {
            setRepositories([]);
            setFollowers([]);
            setSelectedRepo(null);  

            const userResponse = await axios.post('https://autonomizeai-assignment.onrender.com', { username });
            setUserInfo(userResponse.data.details);

            const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
            setRepositories(reposResponse.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchFollowers = async () => {
      try {
          const followersResponse = await axios.get(`https://autonomizeai-assignment.onrender.com/api/users/${username}/friends`);
          setFollowers(followersResponse.data);  
          console.log(followers);
      } catch (error) {
          console.error('Error fetching followers:', error);
      }
  };

    const renderRepositoryDetails = (repo) => (
        <div>
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
            <button onClick={() => setSelectedRepo(null)}>Back</button>
        </div>
    );

    const renderRepositories = () => (
        <div>
            <h2>Repositories</h2>
            <ul>
                {repositories.map((repo) => (
                    <li key={repo.id} onClick={() => setSelectedRepo(repo)}>
                        {repo.name}
                    </li>
                ))}
            </ul>
            <button onClick={fetchFollowers}>View Followers</button>
        </div>
    );

    const renderFollowers = () => (
      <div>
          <h2>Followers</h2>
          <ul>
              {followers.map((follower) => (
                  <li key={follower} onClick={() => {
                      setUsername(follower); // Set the username to the follower
                      handleSearch(); // Fetch details of the new user (follower)
                  }}>
                      {follower}
                  </li>
              ))}
          </ul>
          <button onClick={() => setFollowers([])}>Back</button>
      </div>
  );

    return (
      <>
        <div style={{ padding: '20px' }}>
            <h1>GitHub User Explorer</h1>

            {!userInfo && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter GitHub username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            )}

            {userInfo && (
                <div>
                    <h2>User Info</h2>
                    <img src={userInfo.avatar_url} alt="Avatar" width="100" />
                    <p>Name: {userInfo.name}</p>
                    <p>Location: {userInfo.location}</p>
                    <p>Bio: {userInfo.bio}</p>
                    <button onClick={() => setUserInfo(null)}>Search Another User</button>
                </div>
            )}

            {selectedRepo
                ? renderRepositoryDetails(selectedRepo)
                : repositories.length > 0 && renderRepositories()}

            {followers.length > 0 && renderFollowers()}
        </div>
        <DatabaseManager/>
        </>
    );
    
}

export default App;
