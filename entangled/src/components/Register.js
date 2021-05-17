import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { addUser } from '../api.js';
import { login } from '../api.js';
import { Alert } from 'react';
import './Register.css';

function validateEmail(mail) {
    var regexPattern = /\S+@\S+\.\S+/;
    return regexPattern.test(mail);
}

function testButton() {
    document.getElementById("addUserStatus").innerHTML = ("");
    var firstPass = document.getElementById("password").value;
    var secondPass = document.getElementById("password2").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var language = "eng"; //Needs fixing!

    if(!username) {
        document.getElementById("addUserStatus").innerHTML = ("Enter a username.");
        return;
    }
    if(!firstPass) {
        document.getElementById("addUserStatus").innerHTML = ("Enter a password.");
        return;
    }
    if(!secondPass) {
        document.getElementById("addUserStatus").innerHTML = ("Confirm your password.");
        return;
    }

    if(firstPass != secondPass) {
        document.getElementById("addUserStatus").innerHTML = ("Passwords do not match");
        return;
    }
    if(!validateEmail(email)) {
        document.getElementById("addUserStatus").innerHTML = ("Invalid email");
        return;
    }

    var response = addUser(username, email, firstPass, language);
    if(response.status != "success") {
        document.getElementById("addUserStatus").innerHTML = ("Error: " + response.status);
        return;
    }

    document.getElementById("addUserStatus").innerHTML = ("Account created! Check your email for verification before logging in.");
    document.getElementById("password").value = "";
    document.getElementById("password2").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
}

export default class Register extends React.Component {
    render() {
        const element = (
            <div className="container" id="outer-container">
                <div className="header">
                    <h1 id="title">Account Registration</h1>
                </div>
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

                        <div id="dropDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseRegisterLangBtn">Choose Language</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <a href="#">English</a>
                                    <a href="#">German</a>
                                    <a href="#">Spanish</a>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="inputBoxes" id="login" onClick={testButton}><div id="loginBtnTxt">Create</div></button>

                    </div>
                    <br /><div id="addUserStatus"></div>

                </div>
                <hr id="hr"></hr>
                <div id="alreadyRegisteredLoginText">
                    <h4>Already Registered? Login</h4>
                </div>

            </div>

        );
        return element;
    }
}
