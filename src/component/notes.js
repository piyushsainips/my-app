import React, { useState} from 'react';
import './notes.css';
import { getDatabase, ref as databaseRef, get } from 'firebase/database'; // Firebase imports
import { app } from './firebase'; // Import Firebase initialization

function App() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [notes, setNotes] = useState(null);
  const [pdfs, setPdfs] = useState([]); // State to hold the fetched PDF URLs

  const branches = {
    CSE: "Computer Science Engineering",
    ECE: "Electronics and Communication Engineering",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering"
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const notesData = {
    CSE: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      // Add more subjects
    },
    ECE: {
      1: ['Basic Electronics', 'Mathematics 1', 'Physics 1'],
      2: ['Digital Logic Design', 'Mathematics 2', 'Physics 2'],
      // Add more subjects
    },
    ME: {
      1: ['Mathematics 1', 'Physics 1'],
      2: ['Mathematics 2', 'Physics 2'],
      // Add more subjects
    },
    CS: {
      1: ['Mathematics 1', 'Physics 1'],
      2: ['Mathematics 2', 'Physics 2'],
      // Add more subjects
    }
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSemester('');
    setNotes(null);
    setPdfs([]); // Reset PDF list when branch changes
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    if (branch && notesData[branch][e.target.value]) {
      setNotes(notesData[branch][e.target.value]);
      fetchPdfs(branch, e.target.value); // Fetch PDFs when semester is selected
    } else {
      setNotes(null);
      setPdfs([]); // Reset PDF list if no notes available
    }
  };

  // Function to fetch PDFs from Firebase Realtime Database
  const fetchPdfs = async (branch, semester) => {
    const database = getDatabase(app); // Firebase database instance
    const notesRef = databaseRef(database, `notes/${branch}/semester_${semester}`);
    // Database path for the notes

    try {
      const snapshot = await get(notesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fetchedPdfs = Object.values(data).map((item) => ({
          name: item.name,
          url: item.url,
        }));
        setPdfs(fetchedPdfs);
      } else {
        setPdfs([]); // No PDFs found
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setPdfs([]);
    }
  };

  return (
    <div>
      <h1 className="note-title">
        <span>Knowledge</span> <span className="hub">Hub</span>
      </h1>

      <div className="container">
        <h1 className="h1">Access Notes</h1>

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

        {/* {notes && (
          <div className="notes-section">
            <h2>Notes for {branches[branch]},</h2>
            <ul>
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )} */}

        {pdfs.length > 0 && (
          <div className="pdf-section">
            <h2>Notes for {branches[branch]}:</h2>
            <ul>
              {pdfs.map((pdf, index) => (
                <li key={index}>
                  <a className='url' href={pdf.url} target="_blank" rel="noopener noreferrer">
                  {pdf.name.replace(/\.pdf$/, '')} {/* Remove the .pdf suffix from the name */}

                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!notes && semester && <p>No notes available for this selection.</p>}
        {pdfs.length === 0 && semester && <p>No PDFs available for this selection.</p>}
      </div>
    </div>
  );
}

export default App;
