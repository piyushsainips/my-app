from flask import Flask, request, jsonify
import pickle
import joblib

from flask_cors import CORS
app = Flask(_name_)
CORS(app) 

# Load the trained model
with open('engineering_chatbot_model.pkl', 'rb') as model_file:
    model = joblib.load(model_file)

# Load the vectorizer
with open('vectorizer.pkl', 'rb') as vec_file:
    vectorizer = pickle.load(vec_file)

# Endpoint to get an answer for a question
@app.route('/get-answer', methods=['POST'])
def get_answer():
    # Your function implementation
    data = request.json
    question = data.get('question')

    if not question:
        return jsonify({'error': 'No question provided'})

    # Transform the input question using the vectorizer
    question_vectorized = vectorizer.transform([question])

    # Predict the answer using the trained model
    predicted_answer = model.predict(question_vectorized)[0]

    # Return the predicted answer as a JSON response
    return jsonify({'answer': predicted_answer})

if _name_ == '_main_':
    app.run(debug=True)