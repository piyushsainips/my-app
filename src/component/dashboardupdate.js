import React, { useState, useEffect, useCallback } from 'react';
import './dashboard_page.css';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { getDatabase, ref as databaseRef, onValue, remove } from 'firebase/database';
import { app } from './firebase'; 
import Loading from './waiting1';

const DashboardUpdate = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [materials, setMaterials] = useState([]); // State to store materials
  const [selectedMaterials, setSelectedMaterials] = useState([]); // State to track selected materials for deletion
  const [isLoading, setIsLoading] = useState(false); 
  const [message, setMessage] = useState('');

  const branches = {
    'CSE': ['Physics', 'Into to C', 'BEE', 'Engineering mathematics 1','Engineering mathematics 2','Chemistry','MEFA','M.E.','Environmental Eng.','DSA','C++','S.E.','Linux','AEM','D.E.','Python','Java','Discrete Mathematics','TOC','MPI','CC','DMW','DS','COA','ML','CN','OS','CD','DIP','NLP','ISS','IOT','AOA','GAI','Disaster Management','Deep Learning'],
    'Mechanical': ['Thermodynamics', 'Fluid Mechanics'],
    'Civil': ['Structural Engineering', 'Geotechnical Engineering'],
    'ECE': ['Circuit Theory', 'Electromagnetics'],
  };

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; 

  // Function to fetch uploaded materials from Firebase Realtime Database
  const fetchMaterials = useCallback(() => {
    if (!branch || !semester) return;
    
    const database = getDatabase(app);
    const notesRef = databaseRef(database, `notes/${branch}/semester_${semester}`);
    
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const materialList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMaterials(materialList);
      } else {
        setMaterials([]);
      }
    });
  }, [branch, semester]);

  // Fetch materials whenever branch or semester changes
  useEffect(() => {
    fetchMaterials();
  }, [branch, semester, fetchMaterials]);

  const handleDelete = async () => {
    if (selectedMaterials.length === 0) {
      setMessage('Please select materials to delete.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const storage = getStorage(app);
      const database = getDatabase(app);
  
      const deletePromises = selectedMaterials.map(async (materialId) => {
        const material = materials.find((m) => m.id === materialId);
        if (!material) return;
  
        // Log the material being processed
        console.log(`Processing material: ${JSON.stringify(material)}`);
  
        // Delete from database first
        const materialRef = databaseRef(database, `notes/${branch}/semester_${semester}/${materialId}`);
        await remove(materialRef);
  
        console.log(`Attempting to delete ${material.type} - ${material.name}`);
  
        // Delete from storage if it's a file (PDF or video)
        if (material.type === 'pdf' || material.type === 'video') {
          // Get the file name without the .pdf extension
          const materialNameWithoutPdf = material.name.replace(/\.pdf$/, '');
          const filePath = `${material.type === 'pdf' ? 'notes' : 'videos'}/${branch}/semester_${semester}/${materialNameWithoutPdf}`;
          const fileRef = storageRef(storage, filePath);
  
          console.log(`File path: ${filePath}`); // Log the file path
  
          try {
            await deleteObject(fileRef);
            console.log(`File deleted successfully: ${material.name}`);
          } catch (storageError) {
            console.error(`Error deleting file from storage: ${storageError.message}`);
            throw new Error(`Failed to delete file: ${material.name}`);
          }
        }
      });
  
      await Promise.all(deletePromises);
  
      // Reset state values after deletion, including uploaded materials
      setBranch('');    // Reset branch selection
      setSemester('');  // Reset semester selection
      setMaterials([]); // Reset the uploaded materials
      setSelectedMaterials([]); // Clear selected materials
      setMessage('Selected materials deleted successfully!');
  
    } catch (error) {
      console.error('Error deleting materials:', error.message);
      setMessage('Error deleting materials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  


  const handleSelectMaterial = (materialId) => {
    setSelectedMaterials(prevSelected =>
      prevSelected.includes(materialId)
        ? prevSelected.filter(id => id !== materialId)
        : [...prevSelected, materialId]
    );
  };

  return (
    <div className="dashboard-container1">
      {isLoading && <Loading message="Deleting, please wait..."/>}
      <h2 className="up">Manage Notes and Videos</h2>
      {message && <p className="message">{message}</p>}

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

      {materials.length > 0 ? (
        <div className="materials-list">
          <h3>Uploaded Materials</h3>
          <ul>
            {materials.map(material => (
              <li key={material.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material.id)}
                    onChange={() => handleSelectMaterial(material.id)}
                  />
                  {material.name} ({material.type})
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleDelete} className="delete-btn">Delete Selected</button>
        </div>
      ) : (
        <p>No materials found for the selected branch and semester.</p>
      )}
    </div>
  );
};

export default DashboardUpdate;
