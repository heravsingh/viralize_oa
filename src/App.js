import React, { useState, useEffect } from 'react';

function App() {
 const [data, setData] = useState(null);
 const [leaderboard, setLeaderboard] = useState(null); // State for leaderboard data
 const [userStatuses, setUserStatuses] = useState({}); // State for user statuses
 const [filterStatus, setFilterStatus] = useState('All'); // State for filter status

 useEffect(() => {
    const headers = {
      Authorization: 'Bearer ' + 'lip_RmPpWUxsaMxSYNerfQji',
    };

    // Fetch user data
    fetch('https://lichess.org/api/account', { headers })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching user data: ', error));

    // Fetch leaderboard data
    fetch('https://lichess.org/api/player/top/200/bullet', { headers })
      .then(res => res.json())
      .then(leaderboardData => setLeaderboard(leaderboardData))
      .catch(error => console.error('Error fetching leaderboard data: ', error));
 }, []);

 useEffect(() => {
    const headers = {
      Authorization: 'Bearer ' + 'lip_RmPpWUxsaMxSYNerfQji',
    };

    const fetchUserStatuses = () => {
      // Assuming you have a list of user IDs you're interested in
      const userIds = leaderboard?.users.map(user => user.id).join(',');
      fetch(`https://lichess.org/api/users/status?ids=${userIds}`, { headers })
        .then(res => res.json())
        .then(statuses => setUserStatuses(statuses.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {})))
        .catch(error => console.error('Error fetching user statuses: ', error));
    };

    // Fetch user statuses initially and then every 5 seconds
    fetchUserStatuses();
    const intervalId = setInterval(fetchUserStatuses, 5000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
 }, [leaderboard]);

 const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
 };

 return (
    <div>
      {data ? (
        <div>
          <h1>{data.username}</h1>
          <p>{data.bio}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <div>
        <label htmlFor="filterStatus">Filter by status:</label>
        <select id="filterStatus" value={filterStatus} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Online">Online</option>
        </select>
      </div>

      {leaderboard ? (
        <div>
          <h2>Leaderboard</h2>
          {leaderboard.users
            .filter(player => filterStatus === 'All' || userStatuses[player.id]?.online)
            .map((player, index) => (
              <div key={index}>
                <p>{index + 1}. {player.username} - {player.perfs.bullet.rating}</p>
                <p>Status: {userStatuses[player.id]?.online ? 'Online' : 'Offline'}</p>
              </div>
            ))}
        </div>
      ) : (
        <p>Loading leaderboard...</p>
      )}
    </div>
 );
}

export default App;
