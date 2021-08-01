import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './Login.css';
import { login, cookies } from '../api.js';
import { getGlobalLanguage } from "../api.js";
import { dSettings } from '../dictionary';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

var userLanguage = getGlobalLanguage();

function doLogin(userLang) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!username) {
        document.getElementById("loginUserStatus").innerHTML = dSettings(154, userLang);
        return;
    }
    if (!password) {
        document.getElementById("loginUserStatus").innerHTML = dSettings(153, userLang);
        return;
    }

    var data = login(username, password);
    if (data.error_code == 1) {
        document.getElementById("loginUserStatus").innerHTML = dSettings(156, userLang);
        return;
    }
    else if (data.error_code == 2) {
        document.getElementById("loginUserStatus").innerHTML = dSettings(155, userLang);
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

    state = {
        helpVideo: false
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

    openHelpVideo = () => {
        this.setState((prevState) => ({ helpVideo: !prevState.helpVideo }));
    }

    render() {
        let userLang = this.props.userLang;
        
        return <div className="container">
            <div className="header">
                <h1 id="title">{dSettings(13, userLang)}</h1>
                <div id="iconWrapper" onClick={this.openHelpVideo}>
                    <FontAwesomeIcon icon={faQuestionCircle} id="HomeQuestionCircle" size='2x' />
                </div>
            </div>
            {this.renderRedirect()}
            <div className="LoginBox">
                <div className="LoginFields">
                    <h2 id="leftUsername">{dSettings(60, userLang)}</h2>
                    <input type="text" className="inputBoxes" id="username" /><br />
                    <h2 id="leftPassword">{dSettings(62, userLang)}</h2>
                    <input type="password" className="inputBoxes" id="password" /><br />
                    <button type="button" className="inputBoxes" id="login" onClick={() => doLogin(this.props.userLang)}><div id="loginBtnTxt">{dSettings(65, userLang)}</div></button>


                    <hr id="hr"></hr>

                    <Link to="/register" id="dontHaveAccountText">{dSettings(64, userLang)}{ }{dSettings(14, userLang)}</Link>
                    <Link to="/forgotpass" id="forgotPasswordText">{dSettings(63, userLang)}</Link>


                </div>
            </div>
            <br /><div id="loginUserStatus"></div>
        </div>
    }
}
