import React from 'react';
import { Redirect } from 'react-router-dom';
import './Settings.css';
import { getUserInfo, updateSettings, changePassword, cookies } from '../api.js';
import { dSettings } from '../dictionary.js';

var id;

function validateEmail(mail) {
    var regexPattern = /\S+@\S+\.\S+/;
    return regexPattern.test(mail);
}

function doGetUserInfo() {
    if (!cookies.get('UserID')) return {};
    id = cookies.get('UserID');
    var data = getUserInfo(id);
    return data;
}

function setUserInfo() {
    if(!cookies.get('UserID')) return;
    var data = doGetUserInfo();
    if(data == undefined) return;

    document.getElementById("username").value = data.username;
    document.getElementById("email").value = data.email;
    if (data.cookies == 1) {
        document.getElementById("OptIn").checked = true;
    } else {
        document.getElementById("OptOut").checked = true;
    }
} 

export default class Settings extends React.Component {

    state = {
        userInfo: doGetUserInfo()
    }

    componentDidMount() {
        setUserInfo();
    }

    renderRedirect = () => {
        if(!cookies.get('UserID')) {
            return <Redirect to = '/' />
        }
    }

    doUpdateSettings = () => {
        let email = document.getElementById("email").value;
    
        let language = this.state.userInfo["language"];
    
        let userCookies = 0;
        if (document.getElementById("OptIn").checked) {
            userCookies = 1;
        }
    
		let error = 0;
		let passUpdated = 0;
		if (document.getElementById("changePassword").value != "") {
			if (document.getElementById("changePassword").value === document.getElementById("confirmPassword").value) {
				var data = changePassword(cookies.get("UserID"), document.getElementById("changePassword").value);
				passUpdated = 1;
				if (data.error == 1) {
					error = 1;
					document.getElementById("saveStatus").innerHTML = data.status;
				}
			} else {
				error = 1;
				document.getElementById("saveStatus").innerHTML = "Passwords do not match.";
			}
		}

		if (error === 0) {
        	let data = updateSettings(id, email, language, userCookies);
       		if (data.status == "success") {

            	//update cookie (TEMPORARY)
            	cookies.set('PrefLang', language, { path: '/' });

            	document.getElementById("saveStatus").innerHTML = "Settings have been saved.";
            	window.location.reload();
        	} else {
				if (passUpdated == 1) {
					document.getElementById("saveStatus").innerHTML = "Settings have been saved.";
					window.location.reload();
				} else {
            		document.getElementById("saveStatus").innerHTML = data.status;
				}
       		}
		}

    }

    setLanguage = (newLanguage) => {
        var newUserInfo = {...this.state.userInfo};
        newUserInfo.language = newLanguage;
        this.setState({ userInfo: newUserInfo });
    }

    render() {
        const { userInfo } = this.state;

        return <div className="container">
            {this.renderRedirect()}
            <div className="header">
                <h1 id="title">{dSettings(9, userInfo.language)}</h1>
            </div>

            <div className="SettingsBox">
                <div className="SettingsFields">
                    <div class="inputRow">
                        <h2>{dSettings(1, userInfo.language)}</h2>
                        <input type="text" id="username" disabled />
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(2, userInfo.language)}</h2>
                        <input disabled={true} type="text" id="email" />
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(3, userInfo.language)}</h2>
                        <input type="password" id="changePassword" placeholder={dSettings(4, userInfo.language)}/>
						<input type="password" id="confirmPassword" placeholder={dSettings(14, userInfo.language)}/>
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(5, userInfo.language)}</h2>
                        <div class="dropDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseLangBtn">{dSettings(12, userInfo.language)}</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <button onClick={() => this.setLanguage("eng")}
                                        style={
                                            userInfo.language === "eng" ? { color: 'green' } :
                                                { color: 'black' }
                                        } type="submit" id="englishButton">{dSettings(10, userInfo.language)}</button>
                                    <button onClick={() => this.setLanguage("ger")}
                                        style={
                                            userInfo.language === "ger" ? { color: 'green' } :
                                                { color: 'black' }
                                        } type="submit" id="germanButton">{dSettings(13, userInfo.language)}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(6, userInfo.language)}</h2>
                        <div class="cookies">
                            <input type="radio" id="OptIn" value="OptIn" name="cookieService" />
                            <label for="OptIn">{dSettings(7, userInfo.language)}</label> <br></br>
                            <input type="radio" id="OptOut" value="OptOut" name="cookieService" />
                            <label for="OptOut">{dSettings(8, userInfo.language)}</label> <br></br>
                        </div>
                    </div>
                </div>
                <div class="button">
                    <button type="button" className="inputBoxes" id="save" onClick={this.doUpdateSettings}><div id="saveBtnTxt">{dSettings(11, userInfo.language)}</div></button>
                </div>
                <div id="saveStatus" align="center"></div>
            </div>
        </div>
    }
}
