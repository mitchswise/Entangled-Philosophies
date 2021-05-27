import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './Settings.css';


export default class Settings extends React.Component {
    render() {
        return <div className = "container">
        <div className="header">                       
             <h1 id="title">Account Settings</h1>
        </div>

        <div className="SettingsBox">
                <div className="SettingsFields">
                    <h2 id="leftUsername">Username</h2>
                    <input type="text" className="inputBoxes" id="username" /><br />
                    <h2 id="leftEmail">Email</h2>
                    <input type="text" className="inputBoxes" id="email" /><br />
                    <h2 id="leftPassword">Password</h2>
                    <button type="button" className="inputBoxes" id="settings"><div id="settingsBtnTxt">Change Password</div></button>

                    <h2 id="language">Preferred Language</h2>

                    <div id="dropDownContainer">
                            <div class="dropdown" id="test">
                                <button class="dropbtn" id="chooseRegisterLangBtn">Choose Language</button>
                                <div class="dropdown-content" id="dropdownRegister">
                                    <a href="#">English</a>
                                    <a href="#">German</a>
                                </div>
                            </div>
                    </div>

                    <div>
                        <h2>Cookies</h2>
                        <input type="radio" value="OptIn" name="cookieService" /> Opt In
                        <input type="radio" value="OptOut" name="cookieService" /> Opt Out
                    </div>

                </div>
        </div>
        </div>
    }
}
