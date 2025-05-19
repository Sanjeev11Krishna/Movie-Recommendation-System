import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Recommendation = () => {
  const { search } = useLocation(); // get ?movie=MovieTitle
  const queryParams = new URLSearchParams(search);
  const movieId = queryParams.get('movie_id');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) {
      console.error('Movie title not found in URL');
      return;
    }

    fetch(`http://127.0.0.1:5000/recommend?movie_id=${movieId}&top_n=10`)
      .then((res) => {
        console.log("Response Status:", res.status);
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        return res.json();
      })
      .then((data) => {
        console.log("Recom data:", data);
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, [movieId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Recommended Movies</h1>
      {loading ? (
        <p className="text-gray-500">Loading recommendations...</p>
      ) : movies.length > 0 ? (
        <ul className="list-disc ml-6 text-lg">
          {movies.map((movie) => (
            <li key={movie.movieId}>{movie.title}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations found for this movie.</p>
      )}
    </div>
  );
};

export default Recommendation;
