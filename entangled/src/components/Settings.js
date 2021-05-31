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
                    <div className="SettingsLeft">
                        <h2>Username</h2>
                        <h2>Email</h2>
                        <h2>Password</h2>
                        <h2>Preferred Language</h2>
                        <h2>Cookies</h2>
                    </div>
                    <div className="SettingsRight">
                        <input type="text" id="username" />
                        <input type="text" id="email" />
                        <details>
                            <summary>
                                Change Password
                            </summary>
                            <p>
                                <input type="password" id="password"/>
                                <button>Save Changes</button>
                            </p>
                        </details>
                        <div class="dropDownContainer">
                                <div class="dropdown" id="test">
                                    <button>Choose Language</button>
                                    <div class="dropdown-content" id="dropdownRegister">
                                        <a href="#">English</a>
                                        <a href="#">German</a>
                                    </div>
                                </div>
                        </div>
                        <input type="radio" value="OptIn" name="cookieService" /> Opt In
                        <input type="radio" value="OptOut" name="cookieService" /> Opt Out
                    </div>
                </div>
        </div>
        </div>
    }
}
