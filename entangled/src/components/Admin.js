import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './Login.css';
import {setPerms} from '../api.js';

function doSetPerms() {
    var username = document.getElementById("username").value;
    var permission_level = document.getElementById("permission_level").value;
	setPerms(username, permission_level);
}

export default class Login extends React.Component {
    render() {
        return <div className="container">
            <div className="header">
                <h1 id="title">Add Admin</h1>
            </div>
            <body>

                <input type="text" id="username" /><br />
                <input type="text" id="permission_level" /><br />
                <button type="button" id="setPermsButton" onClick={doSetPerms}>Set Permission Level</button>
                <div id="ansField_adminPage"></div><br/>

            </body>
        </div>
    }
}
