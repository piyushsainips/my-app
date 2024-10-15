import React, { useState, useCallback } from 'react';
import './dashboard_page.css';

const DashboardPage = () => {
    const [branch, setBranch] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const branches = ['Computer Science', 'Mechanical', 'Civil', 'Electrical'];
    const subjects = {
        'Computer Science': ['Data Structures', 'Algorithms', 'Operating Systems'],
        'Mechanical': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design'],
        'Civil': ['Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering'],
        'Electrical': ['Circuit Theory', 'Electromagnetics', 'Control Systems'],
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!branch || !subject || !file) {
            setMessage('Please select branch, subject, and upload a file.');
            return;
        }

        // Here you can handle the file upload logic (e.g., send to an API)
        console.log('Uploading file:', file);
        console.log('Branch:', branch);
        console.log('Subject:', subject);

        // Reset form and show success message
        setBranch('');
        setSubject('');
        setFile(null);
        setMessage('Notes uploaded successfully!');
    };

    return (
        <div className="dashboard-container1">
            <h2 className='up'>Upload Notes</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Branch:</label>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                        <option value="">Select Branch</option>
                        {branches.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Subject:</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!branch}>
                        <option value="">Select Subject</option>
                        {branch && subjects[branch].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Upload Notes:</label>
                    <div
                        className="drop-zone"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        {file ? <p>{file.name}</p> : <p>Drag & drop a file here or click to select one</p>}
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: 'none' }} // Hide the default file input
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
