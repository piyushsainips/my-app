from flask import Flask, request, jsonify
import json
import pickle

app = Flask(__name__)

# Load questions data
with open("./questions.json", "r") as file:
    questions_data = json.load(file)

# Load the trained model
with open("./improvement_model.pkl", "rb") as file:
    improvement_model = pickle.load(file)

@app.route("/api/questions", methods=["GET"])
def get_questions():
    branch = request.args.get("branch")
    semester = request.args.get("semester")
    difficulty = request.args.get("difficulty")

    # Fetch questions based on branch, semester, and difficulty
    questions = (
        questions_data.get(branch, {})
        .get(semester, {})
        .get(difficulty, [])
    )
    if not questions:
        return jsonify({"message": "No questions available"}), 404

    return jsonify(questions)

@app.route("/api/suggestions", methods=["POST"])
def get_suggestions():
    data = request.get_json()
    incorrect_answers = data.get("incorrectAnswers", [])  # List of incorrect question IDs
    suggestions = []

    for answer in incorrect_answers:
        question_id = answer.get("question_id")
        # Predict topic for improvement
        prediction = improvement_model.predict([[question_id, 0, 0]])[0]
        suggestions.append(prediction)

    return jsonify({"suggestions": suggestions})

if __name__ == "__main__":
    app.run(debug=True)
