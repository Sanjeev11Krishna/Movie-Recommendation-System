import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Fetch user interactions
def fetch_interaction_data():
    docs = db.collection("interactions").stream()
    data = []
    for doc in docs:
        record = doc.to_dict()
        if record.get("interactionType") == "watch_trailer":
            data.append({
                "uid": record.get("uid"),
                "movieId": record.get("movieId")
            })
    return pd.DataFrame(data)

# 3. Fetch movies with genres (pipe-separated)
def fetch_movies():
    docs = db.collection("movies").stream()
    data = []
    for doc in docs:
        record = doc.to_dict()
        genres = record.get("genres", "")
        if genres:
            genre_str = genres.replace("|", " ")  # <-- key line
            data.append({
                "movieId": record["movieId"],
                "title": record.get("title", ""),
                "genres": genre_str
            })
    return pd.DataFrame(data)

# 4. Build genre-based TF-IDF matrix
def build_feature_matrix(movies_df):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(movies_df["genres"])
    return tfidf_matrix, movies_df

# 5. Generate recommendations for each user
def get_recommendations(interactions_df, tfidf_matrix, movies_df, user_id, top_n=10):
    watched = interactions_df[interactions_df["uid"] == user_id]["movieId"]
    watched_idx = movies_df[movies_df["movieId"].isin(watched)].index

    if len(watched_idx) == 0:
        return []

    user_vector = tfidf_matrix[watched_idx].mean(axis=0)
    similarities = cosine_similarity(user_vector, tfidf_matrix).flatten()

    movies_df["similarity"] = similarities
    recommendations = movies_df[~movies_df["movieId"].isin(watched)]
    top_recs = recommendations.sort_values(by="similarity", ascending=False).head(top_n)

    return top_recs[["movieId", "title"]].to_dict(orient="records")

# 6. Store recommendations in Firebase
def write_recommendations(uid, recs):
    db.collection("recommendations").add({
        "uid": uid,
        "recommended": recs
    })

# 7. Orchestrate the pipeline
def run_recommendation_pipeline():
    print("🔄 Fetching interaction and movie data...")
    interactions_df = fetch_interaction_data()
    movies_df = fetch_movies()

    if interactions_df.empty or movies_df.empty:
        print("⚠️ No interaction or movie data found.")
        return

    print("🧠 Building TF-IDF matrix...")
    tfidf_matrix, movies_df = build_feature_matrix(movies_df)

    print("📤 Generating recommendations...")
    for uid in interactions_df["uid"].unique():
        recs = get_recommendations(interactions_df, tfidf_matrix, movies_df, uid)
        if recs:
            write_recommendations(uid, recs)
            print(f"✅ Recommendations saved for user: {uid}")
        else:
            print(f"⚠️ No recommendations for user: {uid}")

if __name__ == "__main__":
    run_recommendation_pipeline()