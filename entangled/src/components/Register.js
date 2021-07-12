import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { addUser, sendActivation, cookies } from '../api.js';
import { getGlobalLanguage } from "../api.js";
import { dSettings } from '../dictionary.js';
import './Register.css';

var userLanguage = getGlobalLanguage();

function validateEmail(mail) {
    var regexPattern = /\S+@\S+\.\S+/;
    return regexPattern.test(mail);
}

function doAddUser(preferredLanguage) {
    if(!preferredLanguage) {
        document.getElementById("registerUserStatus").innerHTML = ("Please set your preferred language.");    
        return;
    }
    document.getElementById("registerUserStatus").innerHTML = ("");
    var firstPass = document.getElementById("password").value;
    var secondPass = document.getElementById("password2").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var language = preferredLanguage;
	
	var passLetter = /[abcdefghijklmnopqrstuvwxyz]/;
	var passUpper = /[ABCDEFGHIJKLMNOPWRSTUVWXYZ]/;
	var passNum = /[1234567890]/;
	var passSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!username) {
        document.getElementById("registerUserStatus").innerHTML = ("Enter a username.");
        return;
    }
    if (!firstPass) {
        document.getElementById("registerUserStatus").innerHTML = ("Enter a password.");
        return;
    }
    if (!secondPass) {
        document.getElementById("registerUserStatus").innerHTML = ("Confirm your password.");
        return;
    }

    if (firstPass != secondPass) {
        document.getElementById("registerUserStatus").innerHTML = ("Passwords do not match");
        return;
    }

	if (firstPass.length < 8) {
		document.getElementById("registerUserStatus").innerHTML = ("Password must contain at least 8 characters.");
		return;
	}

	if (!passLetter.test(firstPass) || !passUpper.test(firstPass)) {
		document.getElementById("registerUserStatus").innerHTML = ("Password must contain at least 1 lowercase and uppercase letter.");
		return;
	}

	if (!passNum.test(firstPass)) {	
		document.getElementById("registerUserStatus").innerHTML = ("Password must contain at least 1 number.");
		return;
	}

	if (!passSpecial.test(firstPass)) {
		document.getElementById("registerUserStatus").innerHTML = ("Password must contain at least 1 special character.");
		return;
	}

	if (firstPass.includes(" ")) {
		document.getElementById("registerUserStatus").innerHTML = ("Password must not contain spaces.");
	}

    if (!validateEmail(email)) {
        document.getElementById("registerUserStatus").innerHTML = ("Invalid email");
        return;
    }

    var response = addUser(username, email, firstPass, language);
    if (response.status != "success") {
        document.getElementById("registerUserStatus").innerHTML = ("Error: " + response.status);
        return;
    }

    sendActivation(username);

    document.getElementById("registerUserStatus").innerHTML = ("Account created! Check your email for verification before logging in.");
    document.getElementById("password").value = "";
    document.getElementById("password2").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
}

export default class Register extends React.Component {

    state = {
        preferredLanguage: this.props.userLang
    }

    setLanguage = (newLang) => {
        this.setState({ preferredLanguage: newLang });
    }

    renderRedirect = () => {
        if (cookies.get('UserID')) {
            return <Redirect to='/' />
        }
    }

    render() {
        const { preferredLanguage } = this.state;
        let userLang = this.props.userLang;
        const element = (
            <>
            <div className="container" id="outer-container">
                <div className="header">
                    <h1 id="title">{dSettings(22, userLang)}</h1>
                </div>
                {this.renderRedirect()}
                <div className="RegisterBox">
                    <div className="RegisterFields">
                        <h2 id="leftUsername">{dSettings(17, userLang)}</h2>
                        <input type="text" className="inputBoxes" id="username" /><br />
                        <h2 id="leftPassword">{dSettings(18, userLang)}</h2>
                        <input type="password" className="inputBoxes" id="password" /><br />
                        <h2 id="leftConfirmPassword">{dSettings(24, userLang)}</h2>
                        <input type="password" className="inputBoxes" id="password2" /><br />
                        <h2 id="leftEmail">{dSettings(25, userLang)}</h2>
                        <input type="text" className="inputBoxes" id="email" /><br />

                        <div id="registerDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseRegisterLangBtn">{dSettings(12, userLang)}</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <button onClick={() => this.setLanguage("eng")} 
                                        style={ 
                                            preferredLanguage === "eng" ? {color: 'green'} :
                                            { color: 'black' }
                                        } type="submit" id="englishButton">{dSettings(10, userLang)}</button>
                                    <button onClick={() => this.setLanguage("ger")} 
                                        style={ 
                                            preferredLanguage === "ger" ? {color: 'green'} :
                                            { color: 'black' }
                                        } type="submit" id="germanButton">{dSettings(13, userLang)}</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="inputBoxes" id="login" onClick={() => doAddUser(this.state.preferredLanguage)}>
                            <div id="loginBtnTxt">{dSettings(26, userLang)}</div>
                        </button>


                        <hr id="hr"></hr>

                        <Link to="/login" id="alreadyRegisteredLoginText">{dSettings(27, userLang)} {dSettings(16, userLang)}</Link>
                    </div>
                </div>

            </div>
            <br /><div id="registerUserStatus"></div>
            </>
        );
        return element;
    }
}
