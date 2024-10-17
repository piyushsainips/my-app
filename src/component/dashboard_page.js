import React, { useState, useCallback } from 'react';
import './dashboard_page.css';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as databaseRef, push } from 'firebase/database';
import { app } from './firebase'; // Import your Firebase initialization
import Uploading from './upload'; // Import the Loading component


const DashboardPage = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setisUploading] = useState(false); // Loading state


  // Branch and semester data structure
  const branches = {
    'CSE': ['Physics', 'Into to C', 'BEE','Intro to CS','Engineering mathematics 1','Engineering mathematics 2','Chemistry','MEFA','M.E.','Environmental Eng.','DSA','C++','S.E.','Linux','AEM','D.E.','Python','Java','Discrete Mathematics','TOC','MPI','CC','DMW','DS','COA','ML','CN','OS','CD','DIP','NLP','ISS','IOT','AOA','GAI','Disaster Management','Deep Learning'],
    'Mechanical': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design'],
    'Civil': ['Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering'],
    'ECE': ['Circuit Theory', 'Electromagnetics', 'Control Systems'],
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Define semesters for selection

  // Handle file drop (drag-and-drop)
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      setFile(droppedFiles[0]);
      setMessage('');
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle form submission and file upload to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branch || !semester || !subject || !file) {
      setMessage('Please select branch, semester, subject, and upload a file.');
      return;
    }

    setisUploading(true); // Show the loading screen

    try {
      const storage = getStorage(app); // Firebase Storage instance
      const database = getDatabase(app); // Firebase Realtime Database instance

      // Get the file name without the .pdf extension
      const fileNameWithoutPdf = file.name.replace(/\.pdf$/, '');

      // Reference for Firebase Storage (where file will be uploaded)
      const fileRef = storageRef(storage, `notes/${branch}/semester_${semester}/${fileNameWithoutPdf}`);

      // Upload file to Firebase Storage
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      // Store file metadata in Firebase Realtime Database
      const notesRef = databaseRef(database, `notes/${branch}/semester_${semester}`);
      await push(notesRef, {
        name: file.name,
        url: downloadURL,
        timestamp: Date.now(),
      });

      setMessage('Notes uploaded successfully!');
      setBranch('');
      setSemester('');
      setSubject('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    } finally {
      setisUploading(false); // Hide the loading screen after the process is done
    }
  };

  return (
    <div className="dashboard-container1">
      {/* Conditionally render the Loading component */}
      {isUploading && <Uploading />}

      <h2 className="up">Upload Notes</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Branch:</label>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">Select Branch</option>
            {Object.keys(branches).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Semester:</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} disabled={!branch}>
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!branch || !semester}>
            <option value="">Select Subject</option>
            {branch && branches[branch].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Upload Notes (PDF only):</label>
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? <p>{file.name}</p> : <p>Drag & drop a file here or click to select one</p>}
            <input
              type="file"
              accept=".pdf" // Restrict file input to PDF only
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
        </div>

        <button type="submit" className="upload-btn">Upload</button>
      </form>
    </div>
  );
};

export default DashboardPage;
