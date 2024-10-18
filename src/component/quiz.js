import React, { useState } from "react";
import "./quiz.css"; // Add this file for styling

const quizData = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "Which element is found in all organic compounds?",
    options: ["Hydrogen", "Oxygen", "Nitrogen", "Carbon"],
    answer: "Carbon",
  },
];

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === quizData[currentQuestion].answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="quiz-container">
      {!isFinished ? (
        <div className="quiz-box">
          <h2 className="question-number">
            Question {currentQuestion + 1}/{quizData.length}
          </h2>
          <h3 className="question">{quizData[currentQuestion].question}</h3>
          <div className="options">
            {quizData[currentQuestion].options.map((option) => (
              <button
                key={option}
                className={`option-button ${
                  selectedOption === option ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="controls">
            <button
              className="next-button"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              {currentQuestion < quizData.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="result-box">
          <h2>Quiz Finished!</h2>
          <p>
            Your score is {score}/{quizData.length}
          </p>
          <button className="restart-button" onClick={restartQuiz}>
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
