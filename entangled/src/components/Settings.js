import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './Settings.css';
import { dSettings } from '../dictionary.js';


export default class Settings extends React.Component {
    render() {
		let lang = 'ger';
		let chooseLang = dSettings(10, lang);
		
		const doEnglish = async e => {
			lang = 'eng';
		}
		
		const doGerman = async e => {
			lang = 'ger';
		}
		
        return <div className = "container">
        <div className="header">                       
             <h1 id="title">{dSettings(9, lang)}</h1>
        </div>

        <div className="SettingsBox">
                <div className="SettingsFields">
                    <h2 id="leftUsername">{dSettings(1, lang)}</h2>
                    <input type="text" className="inputBoxes" id="username" /><br />
                    <h2 id="leftEmail">{dSettings(2, lang)}</h2>
                    <input type="text" className="inputBoxes" id="email" /><br />
                    <h2 id="leftPassword">{dSettings(3, lang)}</h2>
                    <button type="button" className="inputBoxes" id="settings"><div id="settingsBtnTxt">{dSettings(4, lang)}</div></button>

                    <h2 id="language">{dSettings(5, lang)}</h2>

                    <div class="dropdown" id="dropdowncontainer">
						<button class="dropbtn" id="dropdown">{chooseLang}</button>
						<div class="dropdown-content">
							<button type="submit" id="englishButton" onClick={doEnglish}>English</button>
							<button type="submit" id="germanButton" onClick={doGerman}>Deutsch</button>
						</div>
					</div>

                    <div>
                        <h2>{dSettings(6, lang)}</h2>
                        <input type="radio" value="OptIn" name="cookieService" /> {dSettings(7, lang)}
                        <input type="radio" value="OptOut" name="cookieService" /> {dSettings(8, lang)}
                    </div>

                </div>
        </div>
        </div>
    }
}
