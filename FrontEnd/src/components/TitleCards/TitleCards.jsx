import React, { useRef, useEffect, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'





const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState([])
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlM2Q3ZWE1OTU4YjJmOTAwNjRhZmVlYzcyOGE2YTJmNCIsIm5iZiI6MTc0NjcxODcwOC44MTIsInN1YiI6IjY4MWNjZmY0Y2M5M2JiYTA1MDZlMzc5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GjXu6BEx4plQYh1MD9-pzVJi2RPBiMBjUddhtV0K7tc'
    }
  };
  

  const handleWheel = (event)=>{
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  }

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(data => setApiData(data.results))
      .catch(err => console.error(err));
  
    const ref = cardsRef.current;
    ref.addEventListener('wheel', handleWheel);
    return () => ref.removeEventListener('wheel', handleWheel);
  }, []);
  

  return (
    <div className='title-cards'>
      <h2>{title?title:"Recommended for You"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index)=>{
          return <div className="card" key={index}>
            <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt="" />
            <p>{card.original_title}</p>
          </div>
        })}
      </div>
    </div>
  )
}

export default TitleCards
