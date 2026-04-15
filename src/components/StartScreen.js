import React from "react";

function StartScreen({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  fetchQuestions,
  leaderboard,
  loading,
  error,
}) {
  return (
    <div className="card">
      <h2>Welcome to Quickly Quizie</h2>
      <p className="screen-text">
        Pick a category and difficulty, then see how many you can get right.
      </p>

      <label>Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="9">General Knowledge</option>
        <option value="18">Computer Science</option>
        <option value="23">History</option>
        <option value="21">Sports</option>
        <option value="27">Animals</option>
      </select>

      <label>Difficulty:</label>
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button onClick={fetchQuestions} disabled={loading}>
        {loading ? "Loading Questions..." : "Begin Quiz"}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="leaderboard">
        <h3>Best Scores</h3>
        {leaderboard.length === 0 ? (
          <p>No scores yet. Be the first one on the board.</p>
        ) : (
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={entry.id}>
                #{index + 1} - {entry.score}/10 ({entry.date})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StartScreen;