import React, { useState, useEffect } from 'react';
import './Admin.css';
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
		outputString += "<ul> username: " + arr[i].username + ", id: " + arr[i].id + "</ul>";
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
            <div class="AdminBox">
				{this.renderRedirect()}

				<div class="AddAdminBox">
				<h2>Username</h2>
                <input type="text" class="inputBoxes" id="username" /><br />
				<h2>Permission Level</h2>
                <input type="text" class="inputBoxes" id="permission_level" /><br />
                <button type="button" id="btn" onClick={doSetPerms}><div id="btnTxt">Set Permission Level</div></button>
                <div id="ansField_adminPage"></div><br/><br/>

				<h2>Username</h2>
				<input type="text" class="inputBoxes" id="usernameGet"/><br/>
				<button type="button" id="btn" onClick={doGetPerms}><div id="btnTxt">Get Permission Level</div></button>
				<div id="permLevel"></div><br/><br/>
				</div>

				<div class="UserListBox">
					<button type="button" id="btn" onClick={doGetAdmins}><div id="btnTxt">Get All Admins</div></button>
					<div id="adminList"></div><br/>
				</div>

            </div>
        </div>
    }
}
