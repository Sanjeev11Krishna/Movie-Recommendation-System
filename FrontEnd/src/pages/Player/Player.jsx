import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, logUserInteraction } from '../../firebase'; // ⬅️ Import from firebase.js

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2Q3ZWE1OTU4YjJmOTAwNjRhZmVlYzcyOGE2YTJmNCIsIm5iZiI6MTc0NjcxODcwOC44MTIsInN1YiI6IjY4MWNjZmY0Y2M5M2JiYTA1MDZlMzc5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GjXu6BEx4plQYh1MD9-pzVJi2RPBiMBjUddhtV0K7tc'
    }
  };

  useEffect(() => {
    // Fetch the trailer video
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(res => {
        if (res.results && res.results.length > 0) {
          setApiData(res.results[0]);
        }
      })
      .catch(err => console.error(err));

    // Log interaction
    const user = auth.currentUser;
    if (user) {
      logUserInteraction(user.uid, 'watch_trailer', id);
    } else {
      console.warn("User not logged in. Interaction not logged.");
    }
  }, [id]);

  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="Back" onClick={() => { navigate('/') }} />
      {apiData.key ? (
        <>
          <iframe
            width='90%'
            height='90%'
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title='trailer'
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <div className="player_info">
            <p>{apiData.published_at?.slice(0, 10)}</p>
            <p>{apiData.name}</p>
            <p>{apiData.type}</p>
          </div>
        </>
      ) : (
        <p>Loading trailer...</p>
      )}
    </div>
  );
};

export default Player;
