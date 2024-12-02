import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, push, ref as dbRef } from "firebase/database";

const UploadQuestionPaper = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const storage = getStorage();
  const database = getDatabase();

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file || !title || !subject || !year) {
      alert("Please fill all fields and select a file.");
      return;
    }

    setUploading(true);

    try {
      // Define storage path
      const filePath = `papers/${year}/${file.name}`;
      const fileRef = ref(storage, filePath);

      // Upload file to Firebase Storage
      await uploadBytes(fileRef, file);

      // Get download URL
      const downloadUrl = await getDownloadURL(fileRef);

      // Save metadata to Firebase Database
      const paperData = {
        title,
        subject,
        year,
        filePath,
        downloadUrl, // Optional: store the download URL
      };

      await push(dbRef(database, "questionPapers"), paperData);

      setSuccessMessage("File uploaded successfully!");
      setTitle("");
      setSubject("");
      setYear("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-question-paper">
      <h2>Upload Question Paper</h2>
      <form onSubmit={handleFileUpload}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload File:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default UploadQuestionPaper;
