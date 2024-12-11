import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/QuizPage.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "../styles/ResultPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { branch, semester, difficulty } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Option labels
  const OPTION_LABELS = ["A", "B", "C", "D"];

  useEffect(() => {
    // Fetch the questions from the backend
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/questions?branch=${encodeURIComponent(
            branch
          )}&semester=${encodeURIComponent(
            semester
          )}&difficulty=${encodeURIComponent(difficulty)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch questions.");
        }

        const data = await response.json();
        setQuestions(data.questions || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching questions.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [branch, semester, difficulty]);

  useEffect(() => {
    setSelectedOptionIndex(null);
  }, [currentQuestionIndex]);

  if (loading) {
    return <div>Loading questions... Please wait!</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available for the selected options!</div>;
  }

  const handleAnswerClick = (isCorrect, questionId, selectedOption, index) => {
    // Prevent multiple selections
    if (selectedOptionIndex !== null) return;

    // Set the selected option index
    setSelectedOptionIndex(index);

    // Add answer to user answers
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { questionId, isCorrect, yourAnswer: selectedOption },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleFinishQuiz = () => {
    const totalQuestions = questions.length;
    const attempts = userAnswers.length;
    const score = userAnswers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers = userAnswers.filter((answer) => !answer.isCorrect);

    // Navigate to the ResultsPage with calculated results
    navigate("/results", {
      state: {
        totalQuestions,
        score,
        attempts,
        incorrectAnswers,
        questions,
        userAnswers,
      },
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Determine option button classes and disabled state
  const getOptionButtonClass = (index) => {
    // If no option selected yet
    if (selectedOptionIndex === null) {
      return "option-button";
    }

    // If this is the selected option
    if (index === selectedOptionIndex) {
      // Correct answer
      if (currentQuestion.options[index] === currentQuestion.answer) {
        return "option-button correct";
      }
      // Incorrect answer
      return "option-button incorrect";
    }

    // Other options when one is selected
    return "option-button disabled";
  };

  return (
    <div className="quiz-page">
      <h2>Quiz Page</h2>
      <div className="question-container">
        <h3>
          Question {currentQuestionIndex + 1}: {currentQuestion.question}
        </h3>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={getOptionButtonClass(index)}
              onClick={() =>
                handleAnswerClick(
                  option === currentQuestion.answer,
                  currentQuestion.id,
                  option,
                  index
                )
              }
              disabled={selectedOptionIndex !== null}
            >
              <span className="option-label">{OPTION_LABELS[index]}</span>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="navigation-buttons">
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            className="next-button"
            onClick={handleNextQuestion}
            disabled={selectedOptionIndex === null}
          >
            Next
          </button>
        ) : (
          <button
            className="finish-button"
            onClick={handleFinishQuiz}
            disabled={selectedOptionIndex === null}
          >
            Finish Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
