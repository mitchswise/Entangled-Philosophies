
import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
import { cookies, setGlobalLanguage } from '../api';
import { getPermLvl, getGlobalLanguage } from '../api.js';
import { dSettings } from '../dictionary.js';

function logout() {
  cookies.remove('UserID', { path: '/' });
  setGlobalLanguage(undefined);
  window.location.reload();
}

var userPermLvl = getPermLvl();

export default class Sidebar extends React.Component {

  renderLogin() {
    if (!cookies.get('UserID')) { //not logged in
      return (
        <Menu>
          <a className="menu-item">
            <Link to="/">{dSettings(4,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/about">{dSettings(5,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to={{ pathname: "/search", state: {} }}>{dSettings(7,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/login">{dSettings(13,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/register">{dSettings(14,this.props.userLang)}</Link>
          </a>

        </Menu>
      );
    }
    else if (userPermLvl == 0) { //regular user
      return (
        <Menu>
          <a className="menu-item">
            <Link to="/">{dSettings(4,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/about">{dSettings(5,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to={{ pathname: "/search", state: {} }}>{dSettings(7,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/tags">{dSettings(123,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/queries">{dSettings(15,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/settings">{dSettings(10,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to={{ pathname: "/", state: {} }} onClick={logout}>{dSettings(11,this.props.userLang)}</Link>
          </a>
        </Menu>
      );
    }
    else if (userPermLvl > 0) { //some administrator
      return (
        <Menu>
          <a className="menu-item">
            <Link to="/">{dSettings(4,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/about">{dSettings(5,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/admin">{dSettings(6,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to={{ pathname: "/search", state: {} }}>{dSettings(7,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/tags">{dSettings(123,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/queries">{dSettings(15,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/uploadpaper">{dSettings(9,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to="/settings">{dSettings(10,this.props.userLang)}</Link>
          </a>
          <a className="menu-item">
            <Link to={{ pathname: "/", state: {} }} onClick={logout}>{dSettings(11,this.props.userLang)}</Link>
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
