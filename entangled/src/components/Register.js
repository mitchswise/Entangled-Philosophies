import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { addUser, sendActivation, cookies } from '../api.js';
import './Register.css';

function validateEmail(mail) {
    var regexPattern = /\S+@\S+\.\S+/;
    return regexPattern.test(mail);
}

function doAddUser(preferredLanguage) {
    if(!preferredLanguage) {
        document.getElementById("addUserStatus").innerHTML = ("Please set your preferred language.");    
        return;
    }
    document.getElementById("addUserStatus").innerHTML = ("");
    var firstPass = document.getElementById("password").value;
    var secondPass = document.getElementById("password2").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var language = preferredLanguage;

    if (!username) {
        document.getElementById("addUserStatus").innerHTML = ("Enter a username.");
        return;
    }
    if (!firstPass) {
        document.getElementById("addUserStatus").innerHTML = ("Enter a password.");
        return;
    }
    if (!secondPass) {
        document.getElementById("addUserStatus").innerHTML = ("Confirm your password.");
        return;
    }

    if (firstPass != secondPass) {
        document.getElementById("addUserStatus").innerHTML = ("Passwords do not match");
        return;
    }
    if (!validateEmail(email)) {
        document.getElementById("addUserStatus").innerHTML = ("Invalid email");
        return;
    }

    var response = addUser(username, email, firstPass, language);
    if (response.status != "success") {
        document.getElementById("addUserStatus").innerHTML = ("Error: " + response.status);
        return;
    }

    sendActivation(username);

    document.getElementById("addUserStatus").innerHTML = ("Account created! Check your email for verification before logging in.");
    document.getElementById("password").value = "";
    document.getElementById("password2").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
}

export default class Register extends React.Component {

    state = {
        preferredLanguage: undefined
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
        const element = (
            <>
            <div className="container" id="outer-container">
                <div className="header">
                    <h1 id="title">Account Registration</h1>
                </div>
                {this.renderRedirect()}
                <div className="RegisterBox">
                    <div className="RegisterFields">
                        <h2 id="leftUsername">Username</h2>
                        <input type="text" className="inputBoxes" id="username" /><br />
                        <h2 id="leftPassword">Password</h2>
                        <input type="password" className="inputBoxes" id="password" /><br />
                        <h2 id="leftConfirmPassword">Confirm Password</h2>
                        <input type="password" className="inputBoxes" id="password2" /><br />
                        <h2 id="leftEmail">Email</h2>
                        <input type="text" className="inputBoxes" id="email" /><br />

                        <div id="registerDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseRegisterLangBtn">Choose Language</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <button onClick={() => this.setLanguage("eng")} 
                                        style={ 
                                            preferredLanguage === "eng" ? {color: 'green'} :
                                            { color: 'black' }
                                        } type="submit" id="englishButton">English</button>
                                    <button onClick={() => this.setLanguage("ger")} 
                                        style={ 
                                            preferredLanguage === "ger" ? {color: 'green'} :
                                            { color: 'black' }
                                        } type="submit" id="germanButton">German</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="inputBoxes" id="login" onClick={() => doAddUser(this.state.preferredLanguage)}>
                            <div id="loginBtnTxt">Create</div>
                        </button>


                        <hr id="hr"></hr>

                        <Link to="/login" id="alreadyRegisteredLoginText">Already Registered? Login</Link>
                    </div>
                </div>

            </div>
            <br /><div id="addUserStatus"></div>
            </>
        );
        return element;
    }
}
