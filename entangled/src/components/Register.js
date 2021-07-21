import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { addUser, sendActivation, cookies } from '../api.js';
import { getGlobalLanguage } from "../api.js";
import { dSettings, wordLookup } from '../dictionary.js';
import './Register.css';

var userLanguage = getGlobalLanguage();

function validateEmail(mail) {
    var regexPattern = /\S+@\S+\.\S+/;
    return regexPattern.test(mail);
}

function doAddUser(preferredLanguage, userLang) {
    if(!preferredLanguage) {
        document.getElementById("registerUserStatus").innerHTML = dSettings(157, userLang);
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
        document.getElementById("registerUserStatus").innerHTML = dSettings(154, userLang);
        return;
    }
    if (!firstPass) {
        document.getElementById("registerUserStatus").innerHTML = dSettings(153, userLang);
        return;
    }
    if (!secondPass) {
        document.getElementById("registerUserStatus").innerHTML = dSettings(76, userLang);
        return;
    }

    if (firstPass != secondPass) {
        document.getElementById("registerUserStatus").innerHTML = dSettings(99, userLang);
        return;
    }

	if (firstPass.length < 8) {
		document.getElementById("registerUserStatus").innerHTML = dSettings(100, userLang);
		return;
	}

	if (!passLetter.test(firstPass) || !passUpper.test(firstPass)) {
		document.getElementById("registerUserStatus").innerHTML = dSettings(101, userLang);
		return;
	}

	if (!passNum.test(firstPass)) {	
		document.getElementById("registerUserStatus").innerHTML = dSettings(102, userLang);
		return;
	}

	if (!passSpecial.test(firstPass)) {
		document.getElementById("registerUserStatus").innerHTML = dSettings(103, userLang);
		return;
	}

	if (firstPass.includes(" ")) {
		document.getElementById("registerUserStatus").innerHTML = dSettings(104, userLang);
	}

    if (!validateEmail(email)) {
        document.getElementById("registerUserStatus").innerHTML = dSettings(158, userLang);
        return;
    }

    var response = addUser(username, email, firstPass, language);
    if (response.status != "success") {
        document.getElementById("registerUserStatus").innerHTML = (dSettings(147, userLang) + ": " + wordLookup(response.status, userLang));
        return;
    }

    sendActivation(username);

    document.getElementById("registerUserStatus").innerHTML = dSettings(159, userLang);
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
                    <h1 id="title">{dSettings(14, userLang)}</h1>
                </div>
                {this.renderRedirect()}
                <div className="RegisterBox">
                    <div className="RegisterFields">
                        <h2 id="leftUsername">{dSettings(60, userLang)}</h2>
                        <input type="text" className="inputBoxes" id="username" /><br />
                        <h2 id="leftPassword">{dSettings(62, userLang)}</h2>
                        <input type="password" className="inputBoxes" id="password" /><br />
                        <h2 id="leftConfirmPassword">{dSettings(76, userLang)}</h2>
                        <input type="password" className="inputBoxes" id="password2" /><br />
                        <h2 id="leftEmail">{dSettings(77, userLang)}</h2>
                        <input type="text" className="inputBoxes" id="email" /><br />

                        <div id="registerDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseRegisterLangBtn">{dSettings(82, userLang)}</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <button onClick={() => this.setLanguage("eng")} 
                                        style={ 
                                            preferredLanguage === "eng" ? {color: 'green'} :
                                            { color: 'black' }
                                        } type="submit" id="englishButton">{dSettings(130, userLang)}</button>
                                    <button onClick={() => this.setLanguage("ger")} 
                                        style={ 
                                            preferredLanguage === "ger" ? {color: 'green'} :
                                            { color: 'black' }
                                        } type="submit" id="germanButton">{dSettings(131, userLang)}</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="inputBoxes" id="login" onClick={() => doAddUser(this.state.preferredLanguage, this.props.userLang)}>
                            <div id="loginBtnTxt">{dSettings(78, userLang)}</div>
                        </button>


                        <hr id="hr"></hr>

                        <Link to="/login" id="alreadyRegisteredLoginText">{dSettings(79, userLang)} {dSettings(13, userLang)}</Link>
                    </div>
                </div>

            </div>
            <br /><div id="registerUserStatus"></div>
            </>
        );
        return element;
    }
}
