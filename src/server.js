const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Read questions from JSON file
const questions = JSON.parse(fs.readFileSync("./questions.json", "utf8"));

// API endpoint to get questions based on branch, semester, and difficulty
app.get("/api/questions", (req, res) => {
    const { branch, semester, difficulty } = req.query;
  
    console.log("Received Query Parameters:", { branch, semester, difficulty }); // Debugging
  
    if (!branch || !semester || !difficulty) {
      return res.status(400).json({ error: "Branch, semester, and difficulty are required!" });
    }
  
    const branchData = questions[branch];
    if (!branchData) {
      console.error(`Branch "${branch}" not found in questions.json.`);
      return res.status(404).json({ error: "Branch not found!" });
    }
  
    const semesterData = branchData[semester];
    if (!semesterData) {
      return res.status(404).json({ error: "Semester not found!" });
    }
  
    const difficultyData = semesterData[difficulty];
    if (!difficultyData || difficultyData.length === 0) {
      return res.status(404).json({ error: "No questions found for the specified difficulty!" });
    }
  
    res.json({ questions: difficultyData });
  });
  
  
  
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
