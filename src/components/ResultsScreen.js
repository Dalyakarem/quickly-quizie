import React from "react";

function ResultsScreen({ score, totalQuestions, restartQuiz }) {
  let resultMessage = "";

  if (score >= 8) {
    resultMessage = "Amazing job! You really know your stuff.";
  } else if (score >= 5) {
    resultMessage = "Nice work! That was a solid score.";
  } else {
    resultMessage = "Good try! Play again and beat your score.";
  }

  return (
    <div className="card">
      <h2>Quiz Finished!</h2>
      <p className="result-message">{resultMessage}</p>
      <p>
        Final Score: {score} / {totalQuestions}
      </p>

      <button onClick={restartQuiz}>Try Again</button>
    </div>
  );
}

export default ResultsScreen;