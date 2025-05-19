from flask import Flask, request, jsonify
import pandas as pd
from content_based_recommender import run_recommendation_pipeline

app = Flask(__name__)

# Load datasets
movies = pd.read_csv('movies.csv')
ratings = pd.read_csv('ratings.csv')
tags = pd.read_csv('tags.csv')

# Preprocessing
movies['genres'] = movies['genres'].apply(lambda x: x.split('|'))
all_genres = sorted({genre for sublist in movies['genres'] for genre in sublist})
for genre in all_genres:
    movies[genre] = movies['genres'].apply(lambda x: int(genre in x))

# Content-Based Filtering by Title
def recommend_by_movie(title, top_n=5):
    movie = movies[movies['title'].str.lower() == title.lower()]
    if movie.empty:
        return []
    
    movie_genres = movie.iloc[0]['genres']
    filtered = movies[movies['genres'].apply(lambda x: any(g in x for g in movie_genres))]
    filtered = filtered.copy()  # ✅ Prevent SettingWithCopyWarning

    avg_ratings = ratings.groupby('movieId')['rating'].mean()
    filtered['avg_rating'] = filtered['movieId'].map(avg_ratings)
    filtered = filtered[filtered['title'].str.lower() != title.lower()]  # Exclude input movie
    filtered = filtered.sort_values('avg_rating', ascending=False)

    return filtered[['movieId', 'title']].head(top_n).to_dict(orient='records')

# Content-Based Filtering by Movie ID
def recommend_by_movie_id(movie_id, top_n=5):
    movie = movies[movies['movieId'] == movie_id]
    if movie.empty:
        return []
    
    movie_genres = movie.iloc[0]['genres']
    filtered = movies[movies['genres'].apply(lambda x: any(g in x for g in movie_genres))]
    filtered = filtered.copy()  # ✅ Prevent SettingWithCopyWarning

    avg_ratings = ratings.groupby('movieId')['rating'].mean()
    filtered['avg_rating'] = filtered['movieId'].map(avg_ratings)
    filtered = filtered[filtered['movieId'] != movie_id]  # Exclude same movie
    filtered = filtered.sort_values('avg_rating', ascending=False)

    return filtered[['movieId', 'title']].head(top_n).to_dict(orient='records')

# Home route
@app.route('/')
def home():
    return "API is working! "

# Recommendation endpoint
@app.route('/recommend', methods=['GET'])
def recommend():
    movie_title = request.args.get('movie')
    movie_id = request.args.get('movie_id', type=int)
    user_id = request.args.get('user_id', type=int)
    top_n = request.args.get('top_n', default=15, type=int)

    if movie_title:
        results = recommend_by_movie(movie_title, top_n)
        return jsonify(results)

    if movie_id is not None:
        results = recommend_by_movie_id(movie_id, top_n)
        return jsonify(results)

    # Optional fallback: highest-rated movies
    if user_id is not None:
        avg_ratings = ratings.groupby('movieId')['rating'].mean().sort_values(ascending=False)
        top_movie_ids = avg_ratings.head(top_n).index
        recommended = movies[movies['movieId'].isin(top_movie_ids)][['movieId', 'title']]
        return jsonify(recommended.to_dict(orient='records'))

    return jsonify({'error': 'Please provide either movie, movie_id, or user_id'}), 400

# Get movie title by ID
@app.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie_title(movie_id):
    movie = movies[movies['movieId'] == movie_id]
    if movie.empty:
        return jsonify({'error': 'Movie not found'}), 404
    title = movie.iloc[0]['title']
    return jsonify({'movieId': movie_id, 'title': title})

@app.route('/run_pipeline', methods=['POST'])
def run_pipeline():
    try:
        run_recommendation_pipeline()
        return jsonify({'status': 'Pipeline executed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

