import React, { useState } from 'react';
import './notes.css';

function App() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [notes, setNotes] = useState(null);

  const branches = {
    CSE: "Computer Science Engineering",
    ECE: "Electronics and Communication Engineering",
    ME: "Mechanical Engineering",
    CS: "Civil Engineering"
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const notesData = {
    CSE: {
      1: ['Intro to CS', 'Mathematics 1', 'Physics 1'],
      2: ['Data Structures', 'Mathematics 2', 'Physics 2'],
      3: ['Algorithms', 'Mathematics 3', 'Physics 3', 'Physics 3', 'Physics 3'],
      4: ['Operating Systems', 'Mathematics 4', 'Physics 4'],
      5: ['Computer Networks', 'Mathematics 5', 'Physics 5', 'Physics 5', 'Physics 5', 'Physics 5', 'Physics 5'],
      6: ['Database Management Systems', 'Mathematics 6', 'Physics 6'],
      7: ['Artificial Intelligence', 'Mathematics 7', 'Physics 7'],
      8: ['Machine Learning', 'Mathematics 8', 'Physics 8'],
      // Add more subjects
    },
    ECE: {
      1: ['Basic Electronics', 'Mathematics 1', 'Physics 1'],
      2: ['Digital Logic Design', 'Mathematics 2', 'Physics 2'],
      3: ['Analog Electronics', 'Mathematics 3', 'Physics 3', 'Physics 3', 'Physics 3'],
      4: ['Signal Processing', 'Mathematics 4', 'Physics 4'],
      5: ['Control Systems', 'Mathematics 5', 'Physics 5', 'Physics 5', 'Physics 5', 'Physics 5'],
      6: ['Communication Systems', 'Mathematics 6', 'Physics 6']
      // Add more subjects
    },
    ME: {
        1: ['Mathematics 1', 'Physics 1'],
        2: ['Mathematics 2', 'Physics 2'],
        3: ['Fluid Mechanics', 'Mathematics 3', 'Physics 3', 'Physics 3', 'Physics 3'],
        4: ['Heat Transfer', 'Mathematics 4', 'Physics 4'],
        5: ['Thermodynamics', 'Mathematics 5', 'Physics 5', 'Physics 5', 'Physics 5'],
        6: ['Engineering', 'Mathematics 6', 'Physics 6']
        },
        CS: {
            1: ['Mathematics 1', 'Physics 1'],
            2: ['Mathematics 2', 'Physics 2'],
            3: ['Physics 3', 'Chemistry 3', 'Mathematics 3'],
            4: ['Physics 4', 'Chemistry 4', 'Mathematics 4'],
            5: ['Physics 5', 'Chemistry 5', 'Mathematics 5'],
            6: ['Physics 6', 'Chemistry 6', 'Mathematics 6']
        },
    
      // Add more subjects
    // Add more branches and semesters as necessary
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSemester('');  // Reset semester when branch is changed
    setNotes(null);   // Reset notes display when branch changes
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    if (branch && notesData[branch][e.target.value]) {
      setNotes(notesData[branch][e.target.value]);
    } else {
      setNotes(null);
    }
  };

  return (
    <div>
         <h1 className="note-title">
                <span>Knowledge</span> <span className="hub">Hub</span>
            </h1>
    
    <div className="container">
      <h1 className='h1'>Access Notes</h1>
      
      <div className="form-group">
        <label htmlFor="branchSelect">Select Branch:</label>
        <select id="branchSelect" value={branch} onChange={handleBranchChange}>
          <option value="">--Choose Branch--</option>
          {Object.keys(branches).map((key) => (
            <option value={key} key={key}>
              {branches[key]}
            </option>
          ))}
        </select>
      </div>

      {branch && (
        <div className="form-group">
          <label htmlFor="semesterSelect">Select Semester:</label>
          <select id="semesterSelect" value={semester} onChange={handleSemesterChange}>
            <option value="">--Choose Semester--</option>
            {semesters.map((sem) => (
              <option value={sem} key={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      )}

      {notes && (
        <div className="notes-section">
          <h2>Notes for {branches[branch]},</h2>
          <ul>
            {notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {!notes && semester && <p>No notes available for this selection.</p>}
    </div>
    </div>
  );
}

export default App;
