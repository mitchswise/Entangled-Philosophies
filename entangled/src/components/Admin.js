import React, { useState, useEffect, useLayoutEffect } from 'react';
import './Admin.css';
import {setPerms} from '../api.js';
import {getPerms} from '../api.js';
import {getAdmins, cookies} from '../api.js';
import { useHistory } from 'react-router-dom';


const Admin = () => {
	const history = useHistory([]);
	const [redirectState, setRedirectState] = useState(false);
	const [adminList, setAdminList] = useState();
	//const [permissionLvlMsg, setPermissionLvlMsg] = useState("");

	useEffect(() => {
		if(!cookies.get('UserID') || cookies.get('PermLvl') < 1) {
			setRedirectState(true);
		}
	});
	useEffect(() => {
		if(redirectState){
			history.push({pathname: '/'})
		}
	});
	useEffect(() => {
		var data = getAdmins();
		var arr = data.admins;
		return doGetAdmins(arr);
	}, []);

	const doSetPerms = () => {
		var username = document.getElementById("username").value;
		//var permission_level = document.getElementById("permission_level").value;
		var permission_level = 1;
		var data = setPerms(username, permission_level);
		document.getElementById("ansField_adminPage").innerHTML = data.status;
		history.go(0);
	};
	
	// const doGetPerms = (props) => {
	// 	var username = props;
	// 	var data = getPerms(username);
	// 	document.getElementById("permLevel").innerHTML = data.permission_level;
	// 	setPermissionLvlMsg(username + " has a permission level of " + data.permission_level);
	// };

	const handleRemove = (props) => {
		setPerms(props, 0);
		history.go(0);
	}

	const doGetAdmins = (props) =>  {
		var data = getAdmins();
		var arr = data.admins;
		console.log(arr.length);
		const list = [];
		const k = props.length - 1;
        for (let i = k; i >= 0; i--) {
            list.push({
                username: props[i].username,
				id: props[i].id,
				num: k-i,
			});
		}
		setAdminList(list.map((array) => {
            return (
				//<ul onClick={() => doGetPerms(array.username)} key={array.id}>
				<details>
				<summary>
                    {array.username} - {array.id}
                </summary>
					<p>
					<button onClick={() => handleRemove(array.username)}>
						Remove {array.username}
					</button>
					</p>
				</details>
            );
        }))
	};

        return (<div className="container">
            <div className="header">
                <h1 id="title">Add Admin</h1>
            </div>
            <div class="AdminBox">

				<div class="AddAdminBox">
				<h2>Username</h2>
                <input type="text" class="inputBoxes" id="username" /><br />
                <button type="button" id="btn" onClick={doSetPerms}><div id="btnTxt">Add Admin</div></button>
                <div id="ansField_adminPage"></div><br/><br/>
				</div>

				<div class="UserListBox">
					<h2>Admins</h2>
					<div id="adminList">{adminList}</div><br/>
				</div>

            </div>
        </div>)
    }

export default Admin;