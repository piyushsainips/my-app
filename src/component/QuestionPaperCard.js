import React, { useState, useEffect } from "react";
import "./QuestionPaperCard.css";
import { FaDownload } from "react-icons/fa";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const QuestionPaperCard = ({ paper }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const storage = getStorage();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);

    // Fetch download URL from Firebase Storage
    const fetchDownloadUrl = async () => {
      try {
        const fileRef = ref(storage, paper.filePath); // `filePath` should be in `paper`
        const url = await getDownloadURL(fileRef);
        setDownloadUrl(url);
      } catch (error) {
        console.error("Error fetching download URL:", error);
      }
    };

    fetchDownloadUrl();

    return () => clearTimeout(timer);
  }, [storage, paper.filePath]);

  return (
    <div className={`question-paper-card ${isLoaded ? "loaded" : ""}`}>
      <h3>{paper.title}</h3>
      <p>Subject: {paper.subject}</p>
      <p>Year: {paper.year}</p>
      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="download-link"
        >
          <FaDownload /> Download
        </a>
      ) : (
        <p>Loading download link...</p>
      )}
    </div>
  );
};

export default QuestionPaperCard;
