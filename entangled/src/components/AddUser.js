import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {addUser} from '../api.js';
import {login} from '../api.js';

function testFunc() {
    var data = addUser();
    document.getElementById("ansField").innerHTML = ("Status: " + data.status);
}

function testLogin() {
	var data = login();
	document.getElementById("ansField").innerHTML = ("Status: " + data.UserID);
}

export default class APITest extends React.Component {
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
        </div>
        );
        return element; 
    }
}