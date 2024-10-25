import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
import pickle
import joblib

# Load the dataset
df = pd.read_csv('engineering_qa.csv')

# Features (questions) and labels (answers)
X = df['question']
y = df['answer']

# Initialize the TfidfVectorizer
vectorizer = TfidfVectorizer()

# Fit and transform the questions using the vectorizer
X_vectorized = vectorizer.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_vectorized, y, test_size=0.2, random_state=42)

# Initialize the Naive Bayes classifier
model = MultinomialNB()

# Train the model
model.fit(X_train, y_train)

# Save the trained model
with open('engineering_chatbot_model.pkl', 'wb') as model_file:
    joblib.dump(model, model_file)

# Save the vectorizer
with open('vectorizer.pkl', 'wb') as vec_file:
    pickle.dump(vectorizer, vec_file)

print("Model and vectorizer have been saved successfully.")
