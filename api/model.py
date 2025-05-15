# model.py

import pandas as pd
import numpy as np
import pickle

# Load the movie data and similarity matrix
movies = pd.read_csv('data/movies.csv')  # Ensure this path is correct
with open('artifacts/similarity.pkl', 'rb') as f:
    similarity = pickle.load(f)

def recommend(movie_title: str):
    movie_title = movie_title.lower()
    if movie_title not in movies['title'].str.lower().values:
        return []
    idx = movies[movies['title'].str.lower() == movie_title].index[0]
    distances = similarity[idx]
    movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    recommended_movies = [movies.iloc[i[0]].title for i in movie_list]
    return recommended_movies
