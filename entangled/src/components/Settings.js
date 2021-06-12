import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './Settings.css';
import { dSettings } from '../dictionary.js';


export default class Settings extends React.Component {
	state = {
		lang: 'eng'
	}

    render() {
		const { lang } = this.state;

		const doEnglish = async e => {
			this.setState({ lang: 'eng' });
		}

		const doGerman = async e => {
			this.setState({ lang: 'ger' });
		}

        return <div className = "container">
        <div className="header">
             <h1 id="title">{dSettings(9, lang)}</h1>
        </div>

        <div className="SettingsBox">
                <div className="SettingsFields">
                        <div class="inputRow">
                            <h2>{dSettings(1, lang)}</h2>
                            <input type="text" id="username" placeholder="Example Username" disabled/>
                        </div>

                        <div class="inputRow">
                            <h2>{dSettings(2, lang)}</h2>
                            <details>
                                <summary>
                                    Change Email
                                </summary>
                                <p>
                                    <input type="text" id="password" placeholder="New Email"/>
                                    <button>Save Changes</button>
                                </p>
                            </details>
                        </div>

                        <div class="inputRow">
                            <h2>{dSettings(3, lang)}</h2>
                            <details>
                                <summary>
                                    Change Password
                                </summary>
                                <p>
                                    <input type="password" id="password" placeholder="New Password"/>
                                    <button>Save Changes</button>
                                </p>
                            </details>
                        </div>

                        <div class="inputRow">
                            <h2>{dSettings(5, lang)}</h2>
                            <div class="dropDownContainer">
                                    <div class="dropdown" id="test">
                                        <button>{dSettings(10, lang)}</button>
                                        <div class="dropdown-content" id="dropdownRegister">
																					<button type="submit" id="englishButton" onClick={doEnglish}>English</button>
																					<button type="submit" id="germanButton" onClick={doGerman}>Deutsch</button>
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
                            <button type="button" className="inputBoxes" id="save"><div id="saveBtnTxt">Save Changes</div></button>
                    </div>
                </div>
        </div>
    }
}
