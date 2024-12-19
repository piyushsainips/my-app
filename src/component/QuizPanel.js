import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './QuizPanel.css'

const branches = [
  { label: "Computer Science", value: "Computer Science" },
  { label: "Electrical Engineering", value: "Electrical Engineering" },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" }
];

const semesters = [
  { label: "1st Semester", value: "1" },
  { label: "2nd Semester", value: "2" }
];

const difficulties = [
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" }
];

const QuizPanel = () => {
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    if (!branch || !semester || !difficulty) {
      alert("Please select all options!");
      return;
    }
  
    // Navigate to QuizPage with selected options as state
    navigate("/quiz", { state: { branch, semester, difficulty } });
  };
  

  return (
    <div className="quiz-panel">
      <h2>Quiz Panel</h2>
      <div>
        <label>Branch:</label>
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="" disabled>
            Select Branch
          </option>
          {branches.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Semester:</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="" disabled>
            Select Semester
          </option>
          {semesters.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Difficulty Level:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="" disabled>
            Select Difficulty
          </option>
          {difficulties.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default QuizPanel;
