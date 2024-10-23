import React, { useState } from 'react';
import { database } from './firebase'; // Import your firebase configuration
import { ref, set } from "firebase/database";
import './UploadQuiz.css'; // Import the CSS file

const UploadQuiz = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');

  const handleUpload = () => {
    if (!branch || !semester || !difficulty || !question || !options[0] || !answer) {
      alert('Please fill all fields');
      return;
    }

    const quizRef = ref(database, `quizzes/${branch}/${semester}/${difficulty}/${Date.now()}`);
    set(quizRef, {
      question,
      options,
      answer,
    }).then(() => {
      alert('Quiz uploaded successfully!');
      // Clear the fields
      setBranch('');
      setSemester('');
      setDifficulty('');
      setQuestion('');
      setOptions(['', '', '', '']);
      setAnswer('');
    }).catch((error) => {
      alert('Error uploading quiz: ' + error.message);
    });
  };

  return (
    <div>
      <h2>Upload Quiz Data</h2>
      <div>
        <label>Branch:</label>
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="Mechanical">Mechanical</option>
        </select>
      </div>
      <div>
        <label>Semester:</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="1">1st Semester</option>
          <option value="2">2nd Semester</option>
          <option value="3">3rd Semester</option>
        </select>
      </div>
      <div>
        <label>Difficulty Level:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div>
        <label>Question:</label>
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
        />
      </div>
      <div>
        <label>Options:</label>
        {options.map((option, index) => (
          <input 
            key={index} 
            type="text" 
            value={option} 
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }} 
          />
        ))}
      </div>
      <div>
        <label>Answer:</label>
        <input 
          type="text" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)} 
        />
      </div>
      <button onClick={handleUpload}>Upload Quiz</button>
    </div>
  );
};

export default UploadQuiz;
