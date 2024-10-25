import pandas as pd

try:
    df = pd.read_csv('engineering_qa.csv')
    print(df.head())
except pd.errors.ParserError as e:
    print("Error reading the CSV file:", e)
except FileNotFoundError:
    df = pd.read_csv('engineering_qa.csv')
    print("The file 'engineering_qa.csv' was not found.")
except Exception as e:
    print("An unexpected error occurred:", e)