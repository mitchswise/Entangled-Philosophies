import React from 'react';
import './Login.css';
import {setPerms} from '../api.js';
import {getPerms} from '../api.js';
import {getAdmins, cookies} from '../api.js';
import { Redirect } from 'react-router-dom';

function doSetPerms() {
    var username = document.getElementById("username").value;
    var permission_level = document.getElementById("permission_level").value;
	var data = setPerms(username, permission_level);
	document.getElementById("ansField_adminPage").innerHTML = data.status;
}

function doGetPerms() {
	var username = document.getElementById("usernameGet").value;
	var data = getPerms(username);
	document.getElementById("permLevel").innerHTML = data.permission_level;
}

function doGetAdmins() {
	var data = getAdmins();
	var arr = data.admins;
	var outputString = "";
	var i;
	for (i = 0; i < arr.length; i++) {
		outputString += "username: " + arr[i].username + ", id: " + arr[i].id + "<br/>";
	}
	document.getElementById("adminList").innerHTML = outputString;
}

export default class Login extends React.Component {

	renderRedirect = () => {
        if(!cookies.get('UserID') || cookies.get('PermLvl') < 1) {
            return <Redirect to = '/' />
        }
    }

    render() {
        return <div className="container">
            <div className="header">
                <h1 id="title">Add Admin</h1>
            </div>
            <body>
				{this.renderRedirect()}
                <input type="text" id="username" /><br />
                <input type="text" id="permission_level" /><br />
                <button type="button" id="setPermsButton" onClick={doSetPerms}>Set Permission Level</button>
                <div id="ansField_adminPage"></div><br/><br/>

				<input type="text" id="usernameGet"/><br/>
				<button type="button" id="getPermsButton" onClick={doGetPerms}>Get Permission Level</button>
				<div id="permLevel"></div><br/><br/>

				<button type="button" id="getAdminsButton" onClick={doGetAdmins}>Get All Admins</button>
				<div id="adminList"></div><br/>

            </body>
        </div>
    }
}
