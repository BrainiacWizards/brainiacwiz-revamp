// quiz leaderboard page showing top players for a specific quiz
import React from "react";

const QuizLeaderboardPage = () => {
  return (
    <div>
      <h1>Quiz Leaderboard</h1>
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

export default QuizLeaderboardPage;
