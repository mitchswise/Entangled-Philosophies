import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './Settings.css';
import { getUserInfo, updateSettings, cookies } from '../api.js';

var id;

function validateEmail(mail) {
	var regexPattern = /\S+@\S+\.\S+/;
	return regexPattern.test(mail);
}

function doGetUserInfo() {
	id = cookies.get('UserID');
	let data = getUserInfo(id);
	
	document.getElementById("username").value = data.username;
	document.getElementById("email").value = data.email;
	if (data.cookies == 1) {
		document.getElementById("OptIn").checked = true;
	} else {
		document.getElementById("OptOut").checked = true;
	}
}

function doUpdateSettings() {
	let email = document.getElementById("email").value;

	let language = "eng"; //PLACEHOLDER

	let cookies = 0;
	if (document.getElementById("OptIn").checked) {
		cookies = 1;
	}

	if (!validateEmail(email)) {
		document.getElementById("saveStatus").innerHTML = "Invalid email.";
	} else {	
		let data = updateSettings(id, email, language, cookies);
		if (data.status == "success") {
			document.getElementById("saveStatus").innerHTML = "Settings have been saved.";
		} else {
			document.getElementById("saveStatus").innerHTML = data.status;
		}
	}
}

export default class Settings extends React.Component {
	componentDidMount() {
		doGetUserInfo();
	}	

    render() {
        return <div className = "container">
        <div className="header">                       
             <h1 id="title">Account Settings</h1>
        </div>

        <div className="SettingsBox">
                <div className="SettingsFields">
                        <div class="inputRow">
                            <h2>Username</h2>
                            <input type="text" id="username" disabled/>
                        </div>

                        <div class="inputRow">
                            <h2>Email</h2>
                            <input type="text" id="email"/>
                        </div>

                        <div class="inputRow">
                            <h2>Password</h2>
                            <button type="button" id="changePassword">Change Password</button>
                        </div>

                        <div class="inputRow">
                            <h2>Preferred Language</h2>
                            <div class="dropDownContainer">
                           		<div class="dropdown" id="test">
                                	<button class="dropbtn" id="chooseLangBtn">Choose Language</button>
                                        <div class="dropdown-content" id="dropdownRegister">
                                            <button type="submit" id="englishButton">English</button>
                                            <button type="submit" id="germanButton">German</button>
                                        </div>
                                    </div>
                            </div>
                        </div>

                        <div class="inputRow">
                        <h2>Cookies</h2>
                        <div class="cookies">
                        <input type="radio" id="OptIn" value="OptIn" name="cookieService" />
                        <label for="OptIn">Opt In</label> <br></br>
                        <input type="radio" id="OptOut" value="OptOut" name="cookieService" /> 
                        <label for="OptOut">Opt Out</label> <br></br>
                        </div>
                        </div>
                    </div>
                    <div class="button">
                            <button type="button" className="inputBoxes" id="save" onClick={doUpdateSettings}><div id="saveBtnTxt">Save Changes</div></button>
                    </div>
					<div id="saveStatus" align="center"></div>
                </div>
        </div>
    }
}
