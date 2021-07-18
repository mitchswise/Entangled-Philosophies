import React from 'react';
import { Redirect } from 'react-router-dom';
import './Settings.css';
import { getUserInfo, updateSettings, changePassword, removeUser, removeAllTags, cookies } from '../api.js';
import { dSettings } from '../dictionary.js';
import { getPermLvl, setGlobalLanguage } from '../api.js';

var id;
var userPermLvl = getPermLvl();

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
        userInfo: doGetUserInfo(),
        userLang: this.props.userLang
    }

    componentDidMount() {
        setUserInfo();
    }

    renderRedirect = () => {
        if(!cookies.get('UserID')) {
            return <Redirect to = '/' />
        }
    }

	doRemoveUser = () => {
		if (window.confirm("Are you sure you want to delete your account? You will lose all your tags, categories, and queries. This cannot be undone.")) {
			let id = cookies.get("UserID");
			let perms = userPermLvl;

			if (perms > 1) {
				document.getElementById("saveStatus").value = "Cannot remove the super admin.";
			} else if (perms == 0) {
				// Remove user's tags and categories
				let removeTagsData = removeAllTags(id);
				console.log("removeTagsData");
				console.log(removeTagsData);
			}

			// Remove user with their saved queries
			let removeUserData = removeUser(id);
			console.log("removeUserData");
			console.log(removeUserData);
			cookies.remove('UserID', { path: '/' });
			window.location.reload();
		}
	}

    doUpdateSettings = () => {
		let passLetter = /[abcdefghijklmnopqrstuvwxyz]/;
		let passUpper = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
		let passNum = /[1234567890]/;
		let passSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        let email = document.getElementById("email").value;

        let language = this.state.userInfo["language"];

        let userCookies = 0;
        if (document.getElementById("OptIn").checked) {
            userCookies = 1;
        }

		let error = 0;
		let passUpdated = 0;
		let firstPass = document.getElementById("changePassword").value;
		let secondPass = document.getElementById("confirmPassword").value;

		if (firstPass != "") {
			if (firstPass !== secondPass) {
				document.getElementById("saveStatus").innerHTML = "Passwords do not match.";
				return;
			}

			if (firstPass.length < 8) {
				document.getElementById("saveStatus").innerHTML = "Password must contain at least 8 characters.";
				return;
			}

			if (!passLetter.test(firstPass) || !passUpper.test(firstPass)) {
				document.getElementById("saveStatus").innerHTML = "Password must contain at least 1 lowercase and uppercase letter.";
				return;
			}

			if (!passNum.test(firstPass)) {
				document.getElementById("saveStatus").innerHTML = "Password must contain at least 1 number.";
				return;
			}

			if (!passSpecial.test(firstPass)) {
				document.getElementById("saveStatus").innerHTML = "Password must contain at least 1 special character.";
				return;
			}

			if (firstPass.includes(" ")) {
				document.getElementById("saveStatus").innerHTML = "Password must not contain spaces.";
				return;
			}

			let data = changePassword(cookies.get("UserID"), document.getElementById("changePassword").value);
			passUpdated = 1;
			if (data.error == 1) {
				document.getElementById("saveStatus").innerHTML = data.status;
				return;
			}
		}

        let data = updateSettings(id, email, language, userCookies);
       	if (data.status == "success") {

          	//update cookie (TEMPORARY)
           	setGlobalLanguage(language);

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

    setLanguage = (newLanguage) => {
        var newUserInfo = {...this.state.userInfo};
        newUserInfo.language = newLanguage;
        this.setState({ userInfo: newUserInfo });
        this.setState({ userLang: newLanguage });
    }

    render() {
        const { userLang } = this.state;

        return <div className="container">
            {this.renderRedirect()}
            <div className="header">
                <h1 id="title">{dSettings(10, userLang)}</h1>
            </div>

            <div className="SettingsBox">
                <div className="SettingsFields">
                    <div class="inputRow">
                        <h2>{dSettings(60, userLang)}</h2>
                        <input type="text" id="username" disabled />
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(77, userLang)}</h2>
                        <input disabled={true} type="text" id="email" />
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(81, userLang)}</h2>
                        <input type="password" id="changePassword" placeholder={dSettings(89, userLang)}/>
						<input type="password" id="confirmPassword" placeholder={dSettings(90, userLang)}/>
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(82, userLang)}</h2>
                        <div class="dropDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseLangBtn">{dSettings(12, userLang)}</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <button onClick={() => this.setLanguage("eng")}
                                        style={
                                            userLang === "eng" ? { color: 'green' } :
                                                { color: 'black' }
                                        } type="submit" id="englishButton">{dSettings(130,this.props.userLang)}</button>
                                    <button onClick={() => this.setLanguage("ger")}
                                        style={
                                            userLang === "ger" ? { color: 'green' } :
                                                { color: 'black' }
                                        } type="submit" id="germanButton">{dSettings(131,this.props.userLang)}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="inputRow">
                        <h2>{dSettings(88, userLang)}</h2>
                        <div class="cookies">
                            <input type="radio" id="OptIn" value="OptIn" name="cookieService" />
                            <label for="OptIn">{dSettings(91, userLang)}</label> <br></br>
                            <input type="radio" id="OptOut" value="OptOut" name="cookieService" />
                            <label for="OptOut">{dSettings(92, userLang)}</label> <br></br>
                        </div>
                    </div>
                </div>
                <div class="button">
                    <button type="button" className="inputBoxes" id="save" onClick={this.doUpdateSettings}><div id="saveBtnTxt">{dSettings(95, userLang)}</div></button>
                </div>
				<br></br>
				<br></br>
				<div class="button">
					<button type="button" className="inputBoxes" id="removeUser" onClick={this.doRemoveUser}><div id="removeUserTxt">{dSettings(98, userLang)}</div></button>
				</div>
                <div id="saveStatus" align="center"></div>
            </div>
        </div>
    }
}
