import React, { useState } from 'react';
import './notes.css';
import { getDatabase, ref as databaseRef, get } from 'firebase/database';
import { app } from './firebase';

function App() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]); // New state for YouTube links

  const branches = {
    CSE: "Computer Science Engineering",
    ECE: "Electronics and Communication Engineering",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering"
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSemester('');
    setPdfs([]);
    setVideos([]);
    setYoutubeVideos([]); // Reset YouTube links when branch changes
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    if (branch) {
      fetchNotesAndVideos(branch, e.target.value);
    } else {
      setPdfs([]);
      setVideos([]);
      setYoutubeVideos([]);
    }
  };

  const fetchNotesAndVideos = async (branch, semester) => {
    const database = getDatabase(app);
    const notesRef = databaseRef(database, `notes/${branch}/semester_${semester}`);

    try {
      const snapshot = await get(notesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fetchedPdfs = [];
        const fetchedVideos = [];
        const fetchedYouTubeVideos = [];
        Object.values(data).forEach(item => {
          if (!item.type || item.type === 'pdf') {
            fetchedPdfs.push({ name: item.name, url: item.url });
          } else if (item.type === 'video') {
            fetchedVideos.push({ name: item.name, url: item.url });
          } else if (item.type === 'youtube') {
            fetchedYouTubeVideos.push({ name: item.name, url: item.url });
          }
        });
        setPdfs(fetchedPdfs);
        setVideos(fetchedVideos);
        setYoutubeVideos(fetchedYouTubeVideos);
      } else {
        setPdfs([]);
        setVideos([]);
        setYoutubeVideos([]);
      }
    } catch (error) {
      console.error('Error fetching notes and videos:', error);
      setPdfs([]);
      setVideos([]);
      setYoutubeVideos([]);
    }
  };

  return (
    <div>
      <h1 className="note-title">
        <span>Knowledge</span> <span className="hub">Hub</span>
      </h1>

      <div className="container">
        <h1 className="h1">Access Notes and Videos</h1>

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

        {/* Display PDF notes */}
        {pdfs.length > 0 && (
          <div className="pdf-section">
            <h2>Notes for {branches[branch]}:</h2>
            <ul>
              {pdfs.map((pdf, index) => (
                <li key={index}>
                  <a className='url' href={pdf.url} target="_blank" rel="noopener noreferrer">
                    {pdf.name.replace(/\.pdf$/, '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display video lectures */}
        {videos.length > 0 && (
          <div className="video-section">
            <h2>Video Lectures for {branches[branch]}:</h2>
            <ul>
              {videos.map((video, index) => (
                <li key={index}>
                  <a className='url' href={video.url} target="_blank" rel="noopener noreferrer">
                    {video.name.replace(/\.(mp4|mkv|avi)$/, '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display YouTube videos */}
        {youtubeVideos.length > 0 && (
          <div className="youtube-section">
            <h2>YouTube Lectures for {branches[branch]}:</h2>
            <ul>
              {youtubeVideos.map((youtube, index) => (
                <li key={index}>
                  <a className='url' href={youtube.url} target="_blank" rel="noopener noreferrer">
                    {youtube.name.replace('YouTube: ', '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(!pdfs.length && !videos.length && !youtubeVideos.length) && semester && <p>No resources available for this selection.</p>}
      </div>
    </div>
  );
}

export default App;
