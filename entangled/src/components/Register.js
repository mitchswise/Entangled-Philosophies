import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {addUser} from '../api.js';
import {login} from '../api.js';
import './Register.css';


function testFunc() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var language = "eng";

    var data = addUser(username, email, password, language);
    document.getElementById("ansField").innerHTML = ("Status: " + data.status);
}

function testLogin() {
    var username = document.getElementById("loginusername").value;
    var password = document.getElementById("loginpassword").value;

	var data = login(username, password);
	document.getElementById("ansField").innerHTML = ("Status: " + data.UserID);
}

export default class APITest extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 
        <div className="header">                       
                                 <h1 id="title">Account Registration</h1>
                            </div>
            <div className = "RegisterBox">
                <div className="RegisterFields">
             <h2 id="leftUsername">Username</h2>       
			<input type="text" className = "inputBoxes" id="username"/><br/>
            <h2 id="leftPassword">Password</h2>       
			<input type="text" className = "inputBoxes" id="password"/><br/>
            <h2 id="leftConfirmPassword">Confirm Password</h2>       
            <input type="text" className = "inputBoxes" id="password2"/><br/>
            <h2 id="leftEmail">Email</h2>
			<input type="text" className = "inputBoxes" id="email"/><br/>
            
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
			<button type="button" className = "inputBoxes" id="login" onClick={testLogin}><div id="loginBtnTxt">Create</div></button>
            
            </div>

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
