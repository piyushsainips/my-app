import React, { useState } from "react";
import { Pie } from "react-chartjs-2";  // Import the Pie chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./quiz.css";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [showProgress, setShowProgress] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); 

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = {
      question: quizData[currentQuestion].question,
      selected: selectedOption,
      correct: quizData[currentQuestion].answer,
    };
    setUserAnswers(newUserAnswers);

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
    setShowProgress(false);
    setUserAnswers([]);
  };

  const toggleProgress = () => {
    setShowProgress(!showProgress);
  };

  // Prepare pie chart data
  const correctAnswers = score;
  const incorrectAnswers = quizData.length - score;

  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Quiz Performance",
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Generate suggestions based on performance
  const getSuggestions = () => {
    const percentageCorrect = (score / quizData.length) * 100;
    if (percentageCorrect === 100) {
      return "Excellent! You answered all the questions correctly. Keep up the great work!";
    } else if (percentageCorrect >= 70) {
      return "Great job! You have a strong understanding of the material, but you can review the questions you missed for improvement.";
    } else {
      return "Keep practicing! It looks like you could benefit from revisiting the topics you're unsure about.";
    }
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
          <div className="result-controls">
            <button className="progress-button" onClick={toggleProgress}>
              {showProgress ? "Hide Progress" : "See Progress"}
            </button>
            <button className="restart-button" onClick={restartQuiz}>
              Restart Quiz
            </button>
          </div>
          {showProgress && (
            <div className="progress-details">
              <h3>Your Progress:</h3>
              <ul>
                {userAnswers.map((answer, index) => (
                  <li
                    key={index}
                    className={`answer-item ${
                      answer.selected === answer.correct ? "correct" : "incorrect"
                    }`}
                  >
                    <strong>Question {index + 1}: {answer.question}</strong>
                    <br />
                    <span>Your Answer: {answer.selected}</span>
                    <br />
                    <span>Correct Answer: {answer.correct}</span>
                  </li>
                ))}
              </ul>
              <div className="chart-container">
                <h4>Performance Chart:</h4>
                <Pie data={data} />
              </div>
              <div className="suggestions">
                <h4>Suggestions:</h4>
                <p>{getSuggestions()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;

