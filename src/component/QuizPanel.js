import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPanel.css'; // Import the CSS file

const QuizPanel = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();

  const startQuiz = () => {
    if (branch && semester && difficulty) {
      navigate('/Quiz', { state: { branch, semester, difficulty } });
    } else {
      alert('Please fill all the fields');
    }
  };

  return (
    <div className="quiz-panel">
      <h2 className="quiz-title">Quiz Panel</h2>
      <form className="quiz-form">
        <div className="form-group">
          <label>Branch:</label>
          <select
            className="form-select"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <select
            className="form-select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
            <option value="3">3rd Semester</option>
          </select>
        </div>
        <div className="form-group">
          <label>Difficulty Level:</label>
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button
          type="button"
          className="start-btn"
          onClick={startQuiz}
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizPanel;
