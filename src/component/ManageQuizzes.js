import React, { useEffect, useState } from 'react';
import { database } from './firebase'; // Import your firebase configuration
import { ref, onValue, update, remove } from "firebase/database";
import './ManageQuizzes.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // For navigation

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const quizzesRef = ref(database, 'quizzes/');
    
    // Fetch quiz data from Firebase
    onValue(quizzesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedQuizzes = [];
      for (const branch in data) {
        for (const semester in data[branch]) {
          for (const difficulty in data[branch][semester]) {
            for (const id in data[branch][semester][difficulty]) {
              loadedQuizzes.push({
                id,
                branch,
                semester,
                difficulty,
                ...data[branch][semester][difficulty][id],
              });
            }
          }
        }
      }
      setQuizzes(loadedQuizzes);
    });
  }, []);

  const handleUpdate = (quiz) => {
    const quizRef = ref(database, `quizzes/${quiz.branch}/${quiz.semester}/${quiz.difficulty}/${quiz.id}`);
    update(quizRef, {
      question: quiz.question,
      options: quiz.options,
      answer: quiz.answer,
    }).then(() => {
      alert('Quiz updated successfully!');
    }).catch((error) => {
      alert('Error updating quiz: ' + error.message);
    });
  };

  const handleDelete = (quiz) => {
    const quizRef = ref(database, `quizzes/${quiz.branch}/${quiz.semester}/${quiz.difficulty}/${quiz.id}`);
    remove(quizRef).then(() => {
      alert('Quiz deleted successfully!');
    }).catch((error) => {
      alert('Error deleting quiz: ' + error.message);
    });
  };

  const handleOptionChange = (e, quiz, index) => {
    const newOptions = [...quiz.options];
    newOptions[index] = e.target.value;
    quiz.options = newOptions;
    setQuizzes([...quizzes]); // Trigger re-render
  };

  // Function to navigate to the quiz upload page
  const handleUpload = () => {
    navigate('/uploadquiz'); // Navigate to the upload quiz page
  };

  return (
    <div className="manage-quizzes-container">
      <h2>Manage Quizzes</h2>
      {quizzes.map((quiz, index) => (
        <div key={index} className="quiz-item">
          <div>
            <label>Branch: {quiz.branch}</label>
          </div>
          <div>
            <label>Semester: {quiz.semester}</label>
          </div>
          <div>
            <label>Difficulty: {quiz.difficulty}</label>
          </div>
          <div>
            <label>Question:</label>
            <input 
              type="text" 
              value={quiz.question} 
              onChange={(e) => {
                quiz.question = e.target.value;
                setQuizzes([...quizzes]); // Trigger re-render
              }} 
            />
          </div>
          <div>
            <label>Options:</label>
            {quiz.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(e, quiz, optionIndex)}
              />
            ))}
          </div>
          <div>
            <label>Answer:</label>
            <input
              type="text"
              value={quiz.answer}
              onChange={(e) => {
                quiz.answer = e.target.value;
                setQuizzes([...quizzes]); // Trigger re-render
              }}
            />
          </div>
          <button onClick={() => handleUpdate(quiz)} className="updatequiz-btn">Update Quiz</button>
          <button onClick={() => handleDelete(quiz)} className="delete-btn">Delete Quiz</button>
          <button onClick={handleUpload} className="uploadquiz-btn">Upload New Quiz</button>
        </div>
      ))}
      
    </div>
  );
};

export default ManageQuizzes;
