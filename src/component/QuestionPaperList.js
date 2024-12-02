import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import QuestionPaperCard from "./QuestionPaperCard";
import "./QuestionPaperList.css";

const QuestionPaperList = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [questionPapers, setQuestionPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const database = getDatabase();
    const papersRef = ref(database, "questionPapers");

    // Fetch data from Firebase Realtime Database
    const unsubscribe = onValue(papersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const papersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setQuestionPapers(papersArray);
      } else {
        setQuestionPapers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply search and filter
  useEffect(() => {
    const results = questionPapers.filter((paper) =>
      paper.title.toLowerCase().includes(search.toLowerCase()) &&
      (year === "" || paper.year === year)
    );
    setFilteredPapers(results);
  }, [search, year, questionPapers]);

  return (
    <div className="question-paper-list">
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by title or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div className="paper-grid">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <QuestionPaperCard key={paper.id} paper={paper} />
            ))
          ) : (
            <p className="no-results">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionPaperList;
