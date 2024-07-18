import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import Questionaire from "./Component/Questionaire";
import Header from "./Component/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const API_URL = "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple";

const fetchImages = async (query) => {
  const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_UNSPLASH_ACCESS_KEY`;
  try {
    const response = await Axios.get(UNSPLASH_URL);
    return response.data.results[0]?.urls?.regular || ''; // Return the URL of the first image
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return '';
  }
};

const fetchQuestions = async (retryCount = 0) => {
  try {
    const response = await Axios.get(API_URL);
    const questions = await Promise.all(response.data.results.map(async (question) => {
      const imageUrl = await fetchImages(question.question);
      return {
        ...question,
        imageUrl,
        answers: [
          question.correct_answer,
          ...question.incorrect_answers,
        ].sort(() => Math.random() - 0.5),
      };
    }));
    return questions;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount < 5) {
      const retryAfter = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.warn(`Retrying in ${retryAfter / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter));
      return fetchQuestions(retryCount + 1);
    } else {
      console.error("Failed to fetch questions:", error);
      throw error;
    }
  }
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questions = await fetchQuestions();
        setQuestions(questions);
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (answer) => {
    if (!showAnswers) {
      if (answer === questions[currentIndex].correct_answer) {
        setScore(score + 1);
      }
    }
    setShowAnswers(true);
  };

  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setShowAnswers(false);
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswers(false);
    }
  };

  const restartGame = async () => {
    setScore(0);
    setCurrentIndex(0);
    try {
      const questions = await fetchQuestions();
      setQuestions(questions);
    } catch (error) {
      console.error("Error restarting game:", error);
    }
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <Header />
      <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
        Toggle Dark Mode
      </button>
      <h2>Score: {score}</h2>
      <h2>
        {currentIndex + 1} out of {questions.length} Questions
      </h2>
      <button onClick={restartGame} className="next-question">
        Restart Game
      </button>
      {currentIndex >= questions.length ? (
        <h1>Game Ended, Your Score is {(score / questions.length) * 100}%</h1>
      ) : (
        <Questionaire
          handleAnswer={handleAnswer}
          showAnswers={showAnswers}
          handleNextQuestion={handleNextQuestion}
          handlePreviousQuestion={handlePreviousQuestion}
          data={questions[currentIndex]}
        />
      )}
    </div>
  );
}

export default App;

