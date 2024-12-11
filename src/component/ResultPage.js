import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const {
    totalQuestions,
    score,
    incorrectAnswers,
    questions,
    userAnswers,
  } = location.state || {};

  useEffect(() => {
    const percentage = totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

    const timer = setTimeout(() => {
      setProgressPercentage(percentage);
    }, 500);

    return () => clearTimeout(timer);
  }, [score, totalQuestions]);

  if (!questions || !userAnswers) {
    return <div>Error: Quiz data is unavailable. Please retry the quiz.</div>;
  }

  const pieData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [score, incorrectAnswers.length],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#45a049", "#e53935"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage < 33) {
      return "You failed.";
    } else if (percentage >= 33 && percentage < 50) {
      return "Good job! You need more improvement in your learning skills.";
    } else if (percentage >= 51 && percentage < 75) {
      return "Nice understanding of topics! Keep doing well.";
    } else if (percentage >= 76 && percentage < 100) {
      return "Great job! You have an awesome understanding mindset, keep it up!";
    } else if (percentage === 100) {
      return "Outstanding! You aced the quiz!";
    }
  };

  const suggestions = incorrectAnswers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    return {
      question: question ? question.question : "Not Available",
      correctAnswer: question ? question.answer : "Not Available",
      yourAnswer: answer.yourAnswer || "Not Attempted",
      explanation: question
        ? question.explanation
        : "Review this topic to improve your understanding.",
      topic: question ? question.topic : "Unknown Topic",
      isIncorrect: true, // Mark as incorrect
    };
  });

  const handleRetakeQuiz = () => {
    navigate("/"); // Navigate to the QuizPanel page
  };

  return (
    <div className="result-page">
      <h2>Quiz Results</h2>
      <div className="result-summary">
        <h3>Summary</h3>
        <p className="total">Total Questions: {totalQuestions}</p>
        <p className="correct">Correct Answers: {score}</p>
        <p className="incorrect">Incorrect Answers: {incorrectAnswers.length}</p>
        <div className="chart-container">
          <Pie data={pieData} options={pieOptions} />
        </div>
        <h3>Overall Performance</h3>
        <div className="progress-container" style={{ position: "relative", height: "30px", background: "#e0e0e0", borderRadius: "15px" }}>
          <div
            className="progress-bar"
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              background: "#4caf50",
              borderRadius: "15px",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
                lineHeight: "30px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {progressPercentage}%
            </span>
          </div>
        </div>
        <p className="performance-message">
          {getPerformanceMessage(progressPercentage)}
        </p>
      </div>

      <div className="suggestions-box">
        <h3>Suggestions</h3>
        {suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <div
              key={index}
              className="suggestion-item"
              style={{
                backgroundColor: item.isIncorrect ? "lightcoral" : "transparent",
                color: "black",
              }}
            >
              {item.isIncorrect && <span className="tag">Incorrect</span>}
              <p>
                <strong>Question:</strong> {item.question}
              </p>
              <p>
                <strong>Your Answer:</strong> {item.yourAnswer}
              </p>
              <p>
                <strong>Correct Answer:</strong> {item.correctAnswer}
              </p>
              <p>
                <strong>Topic:</strong> {item.topic}
              </p>
              <p>
                <strong>Explanation:</strong> {item.explanation}
              </p>
            </div>
          ))
        ) : (
          <p>Great job! No suggestions available.</p>
        )}
      </div>

      <button onClick={handleRetakeQuiz} className="retake-quiz-btn">
        Retake Quiz
      </button>
    </div>
  );
};

export default ResultPage;
