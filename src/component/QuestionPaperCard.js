import React, { useState, useEffect } from "react";
import "./QuestionPaperCard.css";
import { FaDownload } from "react-icons/fa";

const QuestionPaperCard = ({ paper }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading for effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`question-paper-card ${isLoaded ? "loaded" : ""}`}>
      <h3>{paper.title}</h3>
      <p>Subject: {paper.subject}</p>
      <p>Year: {paper.year}</p>
      <a
        href={paper.link}
        target="_blank"
        rel="noopener noreferrer"
        className="download-link"
      >
        <FaDownload /> Download
      </a>
    </div>
  );
};

export default QuestionPaperCard;
