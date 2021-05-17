import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './Login.css';
import { login } from '../api.js';

function doLogin() {
    var username = document.getElementById("login_username").value;
    var password = document.getElementById("login_password").value;

    if(!username) {
        document.getElementById("ansField_loginPage").innerHTML = "Enter a username.";
        return;
    }
    if(!password) {
        document.getElementById("ansField_loginPage").innerHTML = "Enter a password.";
        return;
    }

    var data = login(username, password);
    if(data.error_code == 1) {
        document.getElementById("ansField_loginPage").innerHTML = "Username and password combination does not exist.";
        return;
    }
    else if(data.error_code == 2) {
        document.getElementById("ansField_loginPage").innerHTML = "Account not verified. Please check your email.";
        return;
    }

    //successful login!
	document.getElementById("ansField_loginPage").innerHTML = "Login successful! Work in progress to redirect to search page";
}

export default class Login extends React.Component {
    render() {
        return <div className="container">
            <div className="header">
                <h1 id="title">Login</h1>
            </div>
            <body>

                <input type="text" id="login_username" /><br />
                <input type="text" id="login_password" /><br />
                <button type="button" id="login_loginPage" onClick={doLogin}>Login</button>
                <div id="ansField_loginPage"></div><br/>

            </body>
        </div>
    }
}
