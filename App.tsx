import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Questionaire from "./Component/Questionaire";
import Header from "./Component/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Switch } from "@mui/material";

const UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY"; // Replace with your Unsplash API access key

const fetchImages = async (query) => {
  const UNSPLASH_URL = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`;
  try {
    const response = await axios.get(UNSPLASH_URL);
    return response.data.results[0]?.urls?.regular || ''; // Return the URL of the first image
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return '';
  }
};

const fetchQuestions = async () => {
  try {
    const response = await axios.get("https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple");
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
    console.error("Failed to fetch questions:", error);
    return [];
  }
};

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [toggleDarkMode, setToggleDarkMode] = useState(false);

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

  const toggleDarkTheme = () => {
    setToggleDarkMode(!toggleDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: toggleDarkMode ? 'dark' : 'light',
      primary: {
        main: toggleDarkMode ? '#90caf9' : '#3f51b5',
      },
      secondary: {
        main: toggleDarkMode ? '#f48fb1' : '#f50057',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`container ${toggleDarkMode ? 'dark-mode' : ''}`}>
        <Header />
        <button onClick={toggleDarkTheme} className="dark-mode-toggle">
          {toggleDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <h2>Score: {score}</h2>
        <h2>
          {currentIndex + 1} out of {questions.length} Questions
        </h2>
        <button onClick={restartGame} className="next-question">
          Restart Game
        </button>
        {questions.length > 0 && currentIndex < questions.length ? (
          <Questionaire
            handleAnswer={handleAnswer}
            showAnswers={showAnswers}
            handleNextQuestion={handleNextQuestion}
            handlePreviousQuestion={handlePreviousQuestion}
            data={questions[currentIndex]}
            toggleDarkMode={toggleDarkMode}
          />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </ThemeProvider>
  );
}

}

export default App;

