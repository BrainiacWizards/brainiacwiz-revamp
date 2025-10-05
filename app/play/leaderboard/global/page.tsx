// global leaderboard page showing top players across all quizzes
import React from "react";

const GlobalLeaderboardPage = () => {
  return (
    <div>
      <h1>Global Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through leaderboard data and display each player's rank, name, and score */}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalLeaderboardPage;
