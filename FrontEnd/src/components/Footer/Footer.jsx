import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer'>
      <ul>
        <li><Link to="/team">The Team</Link></li>
        <li>Git Link</li>
        
      </ul>
      <p className="copyright-text"> RecomMovies - A Movie Recommendation System</p>
    </div>
  )
}

export default Footer
