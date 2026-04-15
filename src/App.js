import React, { useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import "./App.css";

const START_SCREEN = "START_SCREEN";
const QUIZ_ACTIVE = "QUIZ_ACTIVE";
const RESULTS_SCREEN = "RESULTS_SCREEN";

function App() {
  const [screen, setScreen] = useState(START_SCREEN);
  const [category, setCategory] = useState("18");
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem("leaderboard");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  const decodeHTML = (text) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
  };

  const shuffleAnswers = (question) => {
    const answers = [
      ...question.incorrect_answers.map((ans) => ({
        text: decodeHTML(ans),
        isCorrect: false,
      })),
      {
        text: decodeHTML(question.correct_answer),
        isCorrect: true,
      },
    ];

    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    return {
      ...question,
      question: decodeHTML(question.question),
      answers,
    };
  };

  const loadQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions.");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("No questions found.");
      }

      const formattedQuestions = data.results.map(shuffleAnswers);

      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setFinalScore(0);
      setScreen(QUIZ_ACTIVE);
    } catch (err) {
      setError("Trivia questions are currently unavailable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = (endingScore) => {
    setFinalScore(endingScore);

    const newEntry = {
      id: Date.now(),
      score: endingScore,
      date: new Date().toLocaleString(),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setLeaderboard(updatedLeaderboard);
    setScreen(RESULTS_SCREEN);
  };

  const goToNextQuestion = (updatedScore) => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz(updatedScore);
    }
  };

  const checkAnswer = (isCorrect) => {
    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(updatedScore);
    }

    goToNextQuestion(updatedScore);
  };

  const handleTimeUp = () => {
    goToNextQuestion(score);
  };

  const restartQuiz = () => {
    setScreen(START_SCREEN);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFinalScore(0);
    setError("");
  };

  return (
    <div className="app">
      <h1>Quickly Quizie</h1>
      <p className="subtitle">A cute little trivia game to test your brain.</p>

      {screen === START_SCREEN && (
        <StartScreen
          category={category}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          fetchQuestions={loadQuestions}
          leaderboard={leaderboard}
          loading={loading}
          error={error}
        />
      )}

      {screen === QUIZ_ACTIVE && questions.length > 0 && (
        <QuizScreen
          key={currentQuestionIndex}
          question={questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          handleAnswer={checkAnswer}
          handleTimeUp={handleTimeUp}
        />
      )}

      {screen === RESULTS_SCREEN && (
        <ResultsScreen
          score={finalScore}
          totalQuestions={questions.length}
          restartQuiz={restartQuiz}
        />
      )}

      <p className="footer-text">Made by Dalya</p>
    </div>
  );
}

export default App;