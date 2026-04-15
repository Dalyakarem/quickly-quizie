import React, { useEffect, useState } from "react";

function QuizScreen({
  question,
  currentQuestionIndex,
  totalQuestions,
  handleAnswer,
  handleTimeUp,
}) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackClass, setFeedbackClass] = useState("");

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timeLeft, handleTimeUp]);

  const handleClick = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer.text);

    if (answer.isCorrect) {
      setFeedbackClass("correct-flash");
    } else {
      setFeedbackClass("wrong-shake");
    }

    setTimeout(() => {
      handleAnswer(answer.isCorrect);
    }, 800);
  };

  return (
    <div className={`card ${feedbackClass}`}>
      <h2>
        Question {currentQuestionIndex + 1} / {totalQuestions}
      </h2>

      <p className="timer">Time Left: {timeLeft}s</p>

      <h3>{question.question}</h3>

      <div className="answers">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleClick(answer)}
            disabled={selectedAnswer !== null}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizScreen;