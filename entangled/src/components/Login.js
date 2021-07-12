import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './Login.css';
import { login, cookies } from '../api.js';
import { getGlobalLanguage } from "../api.js";
import { dSettings } from '../dictionary';

var userLanguage = getGlobalLanguage();

function doLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!username) {
        document.getElementById("loginUserStatus").innerHTML = "Enter a username.";
        return;
    }
    if (!password) {
        document.getElementById("loginUserStatus").innerHTML = "Enter a password.";
        return;
    }

    var data = login(username, password);
    if (data.error_code == 1) {
        document.getElementById("loginUserStatus").innerHTML = "Username and password combination does not exist.";
        return;
    }
    else if (data.error_code == 2) {
        document.getElementById("loginUserStatus").innerHTML = "Account not verified. Please check your email.";
        return;
    }

    cookies.set('UserID', data.UserID, { path: '/' });
    window.location.reload();
}

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.enterLogin = this.enterLogin.bind(this);
    }

    renderRedirect = () => {
        if (cookies.get('UserID')) {
            return <Redirect to='/' />
        }
    }

    enterLogin(event) {
        if (event.keyCode == 13) {
            doLogin();
        }
    }

    componentDidMount() {
        document.getElementById("username").addEventListener("keydown", this.enterLogin, false);
        document.getElementById("password").addEventListener("keydown", this.enterLogin, false);
    }
    componentWillUnmount() {
        document.getElementById("username").removeEventListener("keydown", this.enterLogin, false);
        document.getElementById("password").removeEventListener("keydown", this.enterLogin, false);
    }

    render() {
        let userLang = this.props.userLang;
        
        return <div className="container">
            <div className="header">
                <h1 id="title">{dSettings(16, userLang)}</h1>
            </div>
            {this.renderRedirect()}
            <div className="LoginBox">
                <div className="LoginFields">
                    <h2 id="leftUsername">{dSettings(17, userLang)}</h2>
                    <input type="text" className="inputBoxes" id="username" /><br />
                    <h2 id="leftPassword">{dSettings(18, userLang)}</h2>
                    <input type="password" className="inputBoxes" id="password" /><br />
                    <button type="button" className="inputBoxes" id="login" onClick={doLogin}><div id="loginBtnTxt">{dSettings(19, userLang)}</div></button>


                    <hr id="hr"></hr>

                    <Link to="/register" id="dontHaveAccountText">{dSettings(20, userLang)}{ }{dSettings(22, userLang)}</Link>
                    <Link to="/forgotpass" id="forgotPasswordText">{dSettings(21, userLang)}</Link>


                </div>
            </div>
            <br /><div id="loginUserStatus"></div>
        </div>
    }
}
