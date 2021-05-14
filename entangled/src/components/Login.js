import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './Login.css';
import {login} from '../api.js';

function testLogin() {
	var data = login();
	document.getElementById("ansField").innerHTML = ("Status: " + data.UserID);
}

export default class Home extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 
        <div className="header">
        <h1 id="title">Login</h1>
        </div>
            <div id="ansField">Status: </div><br/>
			<input type="text" id="loginusername" placeholder="Username"/><br/>
			<input type="text" id="loginpassword" placeholder="Password"/><br/>
			<button type="button" id="login" onClick={testLogin}>Login</button>
        </div>
        );
        return element; 
    }
}