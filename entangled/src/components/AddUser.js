import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {addUser, login, sendActivation, resetPassword} from '../api.js';

function testFunc() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var language = "eng";

    var data = addUser(username, email, password, language);
	var data2 = sendActivation(username);
    document.getElementById("ansField").innerHTML = ("Status: " + data.status + "\tStatus2: " + data2.status);
}

function testLogin() {
    var username = document.getElementById("loginusername").value;
    var password = document.getElementById("loginpassword").value;

	var data = login(username, password);
	document.getElementById("ansField").innerHTML = ("Status: " + data.UserID);
}

function testResetPassword() {
    var username = document.getElementById("forgot_username").value;
    var email = document.getElementById("forgot_email").value;

    var data = resetPassword(username, email);
    document.getElementById("ansField").innerHTML = ("Status: " + data.status);
}

export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 
            <h1> Hello World!</h1>
			<input type="text" id="username"/><br/>
			<input type="text" id="email"/><br/>
			<input type="text" id="password"/><br/>
            <button type="button" id="checker" onClick={testFunc}>Test Endpoint</button>
            <div id="ansField">Status: </div><br/>

			<input type="text" id="loginusername"/><br/>
			<input type="text" id="loginpassword"/><br/>
			<button type="button" id="login" onClick={testLogin}>Login</button>

            <h3>Forgot Password? Enter username and email</h3>
            <input type="text" id="forgot_username"/><br/>
            <input type="text" id="forgot_email"/><br/>
            <button type="button" id="resetPass" onClick={testResetPassword}>Reset Password</button>
        </div>
        );
        return element; 
    }
}
