import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './quiz.css'; // Import the CSS file

const Quiz = () => {
  const { state } = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    // Add more questions as needed
  ];

  const handleOptionChange = (e, questionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: e.target.value,
    });
  };

  const submitQuiz = () => {
    setShowResult(true);
  };

  const getCorrectAnswerCount = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedOptions[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResult) {
    const correctAnswers = getCorrectAnswerCount();
    const incorrectAnswers = questions.length - correctAnswers;

    return (
      <div className="quiz-container result-container">
        <h2>Quiz Results</h2>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Incorrect Answers: {incorrectAnswers}</p>
        <p>Total Questions: {questions.length}</p>

        <div className="dashboard">
          <div className="correct">Correct: {correctAnswers}</div>
          <div className="incorrect">Incorrect: {incorrectAnswers}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Quiz</h2>
      <p>Branch: {state.branch}</p>
      <p>Semester: {state.semester}</p>
      <p>Difficulty Level: {state.difficulty}</p>

      <div className="question">
        <h3>{questions[currentQuestionIndex].question}</h3>
        <div className="options">
          {questions[currentQuestionIndex].options.map((option, idx) => (
            <label key={idx}>
              <input
                type="radio"
                value={option}
                name={`question${currentQuestionIndex}`}
                onChange={(e) => handleOptionChange(e, currentQuestionIndex)}
              />
              {option}
            </label>
          ))}
        </div>
        <button
          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
      </div>

      {currentQuestionIndex === questions.length - 1 && (
        <button onClick={submitQuiz}>Submit Quiz</button>
      )}
    </div>
  );
};

export default Quiz;
