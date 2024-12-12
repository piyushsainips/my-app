import pickle
import numpy as np
from sklearn.tree import DecisionTreeClassifier


X = np.array([
    [1, 0, 0],  
    [2, 0, 1], 
    [3, 0, 2],  
    [4, 0, 0],  
    [5, 0, 3],  
])

y = ['Algebra', 'Geometry', 'Trigonometry', 'Algebra', 'Calculus']

clf = DecisionTreeClassifier()
clf.fit(X, y)

with open('quiz_improvement_model.pkl', 'wb') as f:
    pickle.dump(clf, f)

print("Model trained and saved!")
