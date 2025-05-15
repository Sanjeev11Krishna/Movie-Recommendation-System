import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import play_icon from '../../assets/Play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'

const Home = () => {

  const [movie, setMovie] = useState(null);


  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2Q3ZWE1OTU4YjJmOTAwNjRhZmVlYzcyOGE2YTJmNCIsIm5iZiI6MTc0NjcxODcwOC44MTIsInN1YiI6IjY4MWNjZmY0Y2M5M2JiYTA1MDZlMzc5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GjXu6BEx4plQYh1MD9-pzVJi2RPBiMBjUddhtV0K7tc'
  }
};



  useEffect(() => {
  fetch('https://api.themoviedb.org/3/movie/1233069?language=en-US', options)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched movie:", data); // optional for debugging
      setMovie(data);
    })
    .catch(err => console.error(err));
}, []); // <-- this [] is important




  return (
    <div className='home'>
      <Navbar/>
      <div className="hero">
        {movie && movie.backdrop_path && (
      <>
        <img
          src={`https://image.tmdb.org/t/p/w500/`+movie.backdrop_path}
          alt={movie.title}
          className='banner-img'
        />
        <div className="hero-caption">
          <h1 className='hero-title-text'>{movie.title}</h1>
          <p>{movie.overview}</p>
          <div className="hero-btns">
            <button className='btn' onClick={() => window.location.href = `/player/${movie.id}`}>
              <img src={play_icon} alt="" />Play
            </button>
            <button className='btn dark-btn' onClick={() => window.open(`https://www.imdb.com/title/${movie.imdb_id}`, '_blank')}>
              <img src={info_icon} alt="" />More Info
            </button>
          </div>
          <TitleCards/>
        </div>
      </>
    )}
      </div>
      
      <div className="more-cards">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"}/>
        <TitleCards title={"Popular Picks"} category={"popular"}/>
        <TitleCards title={"Upcoming"} category={"upcoming"}/>
        <TitleCards title={"Top pics for you"} category={"now_playing"}/>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
