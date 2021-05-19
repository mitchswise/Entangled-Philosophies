  
import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
import { cookies } from '../api';

function logout() {
  cookies.remove('UserID', { path: '/' });
}

export default props => {
  return (
    <Menu>
      <a className="menu-item">
        <Link to="/">Home</Link>
      </a>
      <a className="menu-item">
        <Link to="/about">About</Link>
      </a>
      <a className="menu-item">
        <Link to="/login">Login</Link>
      </a>
      <a className="menu-item">
        <Link to="/register">Register</Link>
      </a>
      <a className="menu-item">
		    <Link to="/admin">Admin</Link>
	    </a>
      <a className="menu-item">
		    <Link to="/login" onClick={logout} >Logout</Link>
	    </a>
    </Menu>
  );
};
