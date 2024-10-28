import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
        <div className='navbarComponent'>
          <img className="logoNavBar" src={logo} alt="Logo mySocial" />

          <div className="navbar">
            <NavLink 
              to="/" 
              className="nav-item" 
              style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
            >
              <span className="material-icons">home</span>
              <p>Home</p>
            </NavLink>
            <NavLink 
              to="/searchuser" 
              className="nav-item" 
              style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
            >
              <span className="material-icons">search</span>
              <p>Search</p>
            </NavLink>
            <NavLink 
              to="/addPost" 
              className="nav-item" 
              style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
            >
              <span className="material-icons">add_circle_outline</span>
              <p>Add a Post</p>
            </NavLink>
            <NavLink 
              to="/profile" 
              className="nav-item" 
              style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
            >
              <span className="material-icons">account_circle</span>
              <p>Profile</p>
            </NavLink>
          </div>

          <div></div>

        </div>
  );
};

export default Navbar;
