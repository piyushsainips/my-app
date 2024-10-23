import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { database } from './firebase';
import { ref, onValue } from "firebase/database";
import "./quiz.css";
import { useLocation } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const QuizApp = () => {
  const location = useLocation();
  const { branch, semester, difficulty } = location.state || {};

  const [quizData, setQuizData] = useState([]); // Quiz data state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [answerResults, setAnswerResults] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch quiz data based on branch, semester, and difficulty
  useEffect(() => {
    if (branch && semester && difficulty) {
      const quizRef = ref(database, `quizzes/${branch}/${semester}/${difficulty}`);
      onValue(quizRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setQuizData(Object.values(data)); // Convert the object to an array
        }
        setLoading(false); // Stop loading once data is fetched
      });
    }
  }, [branch, semester, difficulty]);

  // Timer Effect
  useEffect(() => {
    if (!isFinished && timeLeft > 0 && !loading) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isFinished && !loading) {
      handleSkipQuestion();
    }
  }, [timeLeft, isFinished, loading]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const isAnswerCorrect = option === quizData[currentQuestion].answer;
    setIsCorrect(isAnswerCorrect);

    setAnswerResults([...answerResults, isAnswerCorrect ? "correct" : "incorrect"]);

    if (isAnswerCorrect) {
      setScore(score + 1);
      navigator.vibrate(200); // Vibration feedback
    }

    setTimeout(() => handleNextQuestion(), 1000);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(20); // Reset timer

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSkipQuestion = () => {
    setSkippedQuestions(skippedQuestions + 1);
    setAnswerResults([...answerResults, "skipped"]);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(20);

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
  };

  const renderPieChart = () => {
    const correctAnswers = answerResults.filter((result) => result === "correct").length;
    const incorrectAnswers = answerResults.filter((result) => result === "incorrect").length;

    const data = {
      labels: ["Correct", "Incorrect", "Skipped"],
      datasets: [
        {
          label: "Quiz Results",
          data: [correctAnswers, incorrectAnswers, skippedQuestions],
          backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
        },
      ],
    };

    return <Pie data={data} />;
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
      {loading ? (
        <div className="loading-screen">
          <h2>Loading Quiz...</h2>
        </div>
      ) : !isFinished && quizData.length > 0 ? (
        <div className="quiz-box">
          <h2 className="question-number">
            Question {currentQuestion + 1}/{quizData.length}
          </h2>
          <h3 className="question">{quizData[currentQuestion].question}</h3>

          <div className="timer">
            Time left: {timeLeft} seconds
          </div>

          <div className="options">
            {quizData[currentQuestion].options.map((option) => (
              <button
                key={option}
                className={`option-button ${
                  selectedOption === option
                    ? isCorrect === true
                      ? "correct-blink"
                      : "incorrect-blink"
                    : ""
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
            <button className="restart-button" onClick={restartQuiz}>
              Restart Quiz
            </button>
            <button className="progress-button" onClick={renderPieChart}>
              See Progress
            </button>
          </div>
          <div className="progress-details">{renderPieChart()}</div>
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