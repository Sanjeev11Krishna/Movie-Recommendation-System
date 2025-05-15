import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import logo1 from '../../assets/logo1.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img1.jpg'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'

const Navbar = () => {
  const navRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false); // 👈 new state

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <img src={logo1} alt="Logo" />
        <ul>
          <li>Home</li>
          <li>Tv shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search_icon} alt="Search" className='icons'/>
        
        <img src={bell_icon} alt="Bell" className='icons'/>

        <div className="navbar-profile" onClick={toggleDropdown}>
          <img src={profile_img} alt="Profile" className='profile'/>
          <img src={caret_icon} alt="Caret"/>
          {dropdownOpen && (
            <div className="dropdown">
              <p onClick={logout}>Sign Out of RecomMovies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
