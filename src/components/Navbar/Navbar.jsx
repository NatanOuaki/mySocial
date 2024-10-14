import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
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
  );
};

export default Navbar;
