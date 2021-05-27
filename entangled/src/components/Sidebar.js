
import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
import { cookies } from '../api';

function logout() {
  cookies.remove('UserID', { path: '/' });
  cookies.remove('PermLvl', { path: '/' });
  window.location.reload();
}

export default class Sidebar extends React.Component {

  renderLogin() {
    if (!cookies.get('UserID')) { //not logged in
      return (
        <Menu>
          <a className="menu-item">
            <Link to="/">Home</Link>
          </a>
          <a className="menu-item">
            <Link to="/about">About</Link>
          </a>
          <a className="menu-item">
            <Link to="/search">Search</Link>
          </a>
          <a className="menu-item">
            <Link to="/login">Login</Link>
          </a>
          <a className="menu-item">
            <Link to="/register">Register</Link>
          </a>

        </Menu>
      );
    }
    else if (cookies.get('PermLvl') == 0) { //regular user
      return (
        <Menu>
          <a className="menu-item">
            <Link to="/">Home</Link>
          </a>
          <a className="menu-item">
            <Link to="/about">About</Link>
          </a>
          <a className="menu-item">
            <Link to="/search">Search</Link>
          </a>
          <a className="menu-item">
            <Link to="/tags">Tags</Link>
          </a>
          <a className="menu-item">
            <Link to="/" onClick={logout}>Logout</Link>
          </a>
        </Menu>
      );
    }
    else if (cookies.get('PermLvl') > 0) { //some administrator
      return (
        <Menu>
          <a className="menu-item">
            <Link to="/">Home</Link>
          </a>
          <a className="menu-item">
            <Link to="/about">About</Link>
          </a>
          <a className="menu-item">
            <Link to="/admin">Admin</Link>
          </a>
          <a className="menu-item">
            <Link to="/search">Search</Link>
          </a>
          <a className="menu-item">
            <Link to="/tags">Tags</Link>
          </a>
		  <a className="menu-item">
			<Link to="/uploadpaper">Upload Paper</Link>
		  </a>
          <a className="menu-item">
            <Link to="/" onClick={logout}>Logout</Link>
          </a>
        </Menu>
      );
    }

  }

  render() {
    const element = (
      this.renderLogin()
    );
    return element;

  }
}
