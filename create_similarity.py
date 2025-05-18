import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import os

# Load your movies data
movies = pd.read_csv('data/movies.csv')  # Adjust path as needed

# Example: create TF-IDF matrix based on movie tags or description
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['tags'])

# Calculate similarity matrix
similarity = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Make sure the artifacts directory exists
os.makedirs('artifacts', exist_ok=True)

# Save the similarity matrix pickle file inside artifacts/
with open('artifacts/similarity.pkl', 'wb') as f:
    pickle.dump(similarity, f)

print("Similarity matrix saved to artifacts/similarity.pkl")