import React, { useState, useEffect, useLayoutEffect } from 'react';
import './Admin.css';
import { getGlobalLanguage, setPerms } from '../api.js';
import { getPerms } from '../api.js';
import { getAdmins, cookies } from '../api.js';
import { useHistory } from 'react-router-dom';
import { getPermLvl } from '../api.js';
import { dSettings } from '../dictionary.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTimes, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

var userPermLvl = getPermLvl();
var curLanguage = getGlobalLanguage();

const Admin = () => {
	const history = useHistory([]);
	const [redirectState, setRedirectState] = useState(false);
	const [adminList, setAdminList] = useState();

	useEffect(() => {
		if (!cookies.get('UserID') || userPermLvl < 1) {
			setRedirectState(true);
		}
	});
	useEffect(() => {
		if (redirectState) {
			history.push({ pathname: '/' })
		}
	});
	useEffect(() => {
		var data = getAdmins();
		var arr = data.admins;
		return doGetAdmins(arr);
	}, []);

	const doSetPerms = () => {
		var username = document.getElementById("username").value;
		var permission_level = 1;
		var checkData = getPerms(username, permission_level);
		if (checkData.error != "") {
			document.getElementById("ansField_adminPage").innerHTML = checkData.error;
		} else if (checkData.permission_level > 0) {
			document.getElementById("ansField_adminPage").innerHTML = username + " is already an admin.";
		} else {
			var data = setPerms(username, permission_level);
			document.getElementById("ansField_adminPage").innerHTML = data.status;
			history.go(0);
		}
	};

	const handleRemove = (username, id) => {
		if (id == cookies.get("UserID")) {
			window.alert("You cannot remove yourself.");
		} else {
			setPerms(username, 0);
			history.go(0);
		}
	}

	const doGetAdmins = (props) => {
		var data = getAdmins();
		var arr = data.admins;
		console.log(arr.length);
		const list = [];
		const k = props.length - 1;
		for (let i = k; i >= 0; i--) {
			list.push({
				username: props[i].username,
				id: props[i].id,
				num: k - i,
			});
		}
		setAdminList(list.map((array) => {
			if (userPermLvl > 1) {
				return (
					<details>
						<summary>
							<FontAwesomeIcon icon={faUser} /><span>&nbsp;&nbsp;</span>
							{array.username} <span id="idColor">[{array.id}]</span>
							<div id="removeUserAdmin" onClick={() => handleRemove(array.username, array.id)}>
								<FontAwesomeIcon icon={faTimes} />
							</div>
						</summary>
					</details>
				);
			} else {
				return (
					<details>
						<summary>
							<FontAwesomeIcon icon={faUser} /><span>&nbsp;&nbsp;</span>
							{array.username} <span id="idColor">[{array.id}]</span>
						</summary>
					</details>
				);
			}
		}))
	};

	return (<div className="container">
		<div className="header">
			<h1 id="title">{dSettings(58, curLanguage)}</h1>
			<div id="iconWrapper">
				<FontAwesomeIcon icon={faQuestionCircle} id="HomeQuestionCircle" size='2x' />
			</div>
		</div>
		<div class="AdminBox">

			<div class="AddAdminBox">
				<h2>{dSettings(60, curLanguage)}</h2>
				<input type="text" class="inputBoxes" id="username" /><br />
				<button type="button" id="btn" onClick={doSetPerms}><div id="btnTxt">{dSettings(58, curLanguage)}</div></button>
				<div id="ansField_adminPage"></div><br /><br />
			</div>

			<div class="UserListBox">
				<h2>{dSettings(59, curLanguage)}</h2>
				<div id="adminList">{adminList}</div><br />
			</div>

		</div>
	</div>)
}

export default Admin;
