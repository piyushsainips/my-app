import React, { useState, useEffect, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import "./quiz.css";
import warningSound from '../assest/intro_music.mp3';

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
  const [timeLeft, setTimeLeft] = useState(20);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answerResults, setAnswerResults] = useState([]);
  const [isBlinking, setIsBlinking] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // Sound effect
  const audioRef = React.useRef(new Audio(warningSound));

  // Handle skipping questions
  const handleSkipQuestion = useCallback(() => {
    setSkippedQuestions((prev) => prev + 1);
    setAnswerResults((prev) => [...prev, "skipped"]);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(20);
    setIsBlinking(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestion, quizData.length]);

  // Timer and blinking logic
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timerId = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        if (timeLeft === 5) {
          setIsBlinking(true);
          audioRef.current.play();
        }
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isFinished) {
      handleSkipQuestion();
    } else {
      setIsBlinking(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [timeLeft, isFinished, handleSkipQuestion]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const isAnswerCorrect = option === quizData[currentQuestion].answer;
    setIsCorrect(isAnswerCorrect);
    
    setAnswerResults([...answerResults, isAnswerCorrect ? "correct" : "incorrect"]);

    if (isAnswerCorrect) {
      setScore(score + 1);
      navigator.vibrate(200);
    }
    
    setTimeout(() => handleNextQuestion(), 1000);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(20);
    setIsBlinking(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSkippedQuestions(0);
    setAnswerResults([]);
    setIsFinished(false);
    setTimeLeft(20);
    setIsBlinking(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const renderPieChart = () => {
    const correctAnswers = answerResults.filter(result => result === "correct").length;
    const incorrectAnswers = answerResults.filter(result => result === "incorrect").length;
    const skipped = skippedQuestions;

    const data = {
      labels: ["Correct", "Incorrect", "Skipped"],
      datasets: [
        {
          label: "Quiz Results",
          data: [correctAnswers, incorrectAnswers, skipped],
          backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
          hoverBackgroundColor: ["#66bb6a", "#ef5350", "#ffee58"],
        },
      ],
    };

    const totalQuestions = quizData.length;
    const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    const incorrectPercentage = ((incorrectAnswers / totalQuestions) * 100).toFixed(2);
    const skippedPercentage = ((skipped / totalQuestions) * 100).toFixed(2);

    return (
      <div className="chart-and-details">
        <Pie data={data} />
        <div className="chart-details">
          <p><strong>Correct:</strong> {correctAnswers} ({correctPercentage}%)</p>
          <p><strong>Incorrect:</strong> {incorrectAnswers} ({incorrectPercentage}%)</p>
          <p><strong>Skipped:</strong> {skipped} ({skippedPercentage}%)</p>
        </div>
      </div>
    );
  };

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
          <h2 className="question-number">Question {currentQuestion + 1}/{quizData.length}</h2>
          <h3 className="question">{quizData[currentQuestion].question}</h3>
          
          <div className={`timer ${isBlinking ? "blink" : ""}`}>
            Time left: {timeLeft} seconds
          </div>

          <div className="options">
            {quizData[currentQuestion].options.map((option) => (
              <button
                key={option}
                className={`option-button ${selectedOption === option 
                  ? isCorrect === true 
                    ? "correct-blink" 
                    : "incorrect-blink"
                  : ""}`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="controls">
            <button className="next-button" onClick={handleNextQuestion} disabled={!selectedOption}>
              {currentQuestion < quizData.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}></div>
          </div>
        </div>
      ) : (
        <div className="result-box">
          <button className="back-button" onClick={() => navigate("/")}>
            Back
          </button>
          <h2>Quiz Finished!</h2>
          <p>Your score is {score}/{quizData.length}</p>
          <div className="result-controls">
            <button className="restart-button" onClick={restartQuiz}>Restart Quiz</button>
            <button className="progress-button" onClick={renderPieChart}>See Progress</button>
          </div>
          <div className="progress-details">
            {renderPieChart()}
          </div>
          <div className="suggestion-box">
            <h3>Suggestions:</h3>
            <p>{getSuggestions()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
