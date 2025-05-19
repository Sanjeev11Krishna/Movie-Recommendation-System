import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: '',
    key: '',
    published_at: '',
    type: ''
  });

  const [movieTitle, setMovieTitle] = useState('');
  const [loadingTitle, setLoadingTitle] = useState(true);
  const [titleError, setTitleError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2Q3ZWE1OTU4YjJmOTAwNjRhZmVlYzcyOGE2YTJmNCIsIm5iZiI6MTc0NjcxODcwOC44MTIsInN1YiI6IjY4MWNjZmY0Y2M5M2JiYTA1MDZlMzc5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GjXu6BEx4plQYh1MD9-pzVJi2RPBiMBjUddhtV0K7tc'
    }
  };

  // Fetch trailer info
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(res => {
        const trailer = res.results.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );
        if (trailer) {
          setApiData(trailer);
        } else {
          setApiData({ name: 'Trailer not found', key: '', published_at: '', type: '' });
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  // Fetch movie title from your backend
  useEffect(() => {
    setLoadingTitle(true);
    fetch(`http://127.0.0.1:5000/movies/${id}`)
      .then(res => {
        console.log('Movie Fetch Status:', res.status);
        if (!res.ok) throw new Error('Failed to fetch movie title');
        return res.json();
      })
      .then(data => {
        console.log('Movie Data:', data);
        setMovieTitle(data.title);
        setLoadingTitle(false);
      })
      .catch(err => {
        setTitleError(err.message);
        setLoadingTitle(false);
      });
  }, [id]);

  // Fetch recommendations
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/recommend?movie_id=${id}`)
      .then(res => res.json())
      .then(data => {
        setRecommendations(data.recommendations || []);
      })
      .catch(err => {
        console.error('Error fetching recommendations:', err);
        setRecommendations([]);
      });
  }, [id]);

  // Navigate to recommendations page
  const handleRecommendationsClick = () => {
    if (id) {
      navigate(`/recommendations?movie_id=${id}`);
    }
  };

  return (
    <div className="player">
      <img src={back_arrow_icon} alt="Back" onClick={() => navigate('/')} />

      {apiData.key ? (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="trailer-unavailable">
          <p>Trailer not available.</p>
        </div>
      )}

      <div className="player_info">
        <p>{apiData.published_at?.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>

      <p>Movie Title: {movieTitle || 'Not loaded'}</p>
      {loadingTitle && <p>Loading movie info...</p>}
      {titleError && <p style={{ color: 'red' }}>{titleError}</p>}
      {!loadingTitle && !titleError && (
        <button onClick={handleRecommendationsClick} className="recommendation-button">
          See Recommendations for "{movieTitle}"
        </button>
      )}

      <div className="recommendations">
        <h3>Recommended Movies</h3>
        {recommendations.length > 0 ? (
          <ul>
            {recommendations.map((movie) => (
              <li key={movie.movieId}>{movie.title}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations found.</p>
        )}
      </div>
    </div>
  );
};

export default Player;
