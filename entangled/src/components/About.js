import React from 'react';
import { cookies } from '../api';
import { dSettings } from '../dictionary';
import './About.css';

export default class About extends React.Component {

    updateCookiePerms = (removeCookie) => {
        if(!removeCookie) {
            cookies.set('CookieConsent', "true");
            document.getElementById("cookiesOptStatus").innerHTML = `<p>Cookies will be stored</p>`
        }
        else {
            cookies.set('CookieConsent', "false");
            document.getElementById("cookiesOptStatus").innerHTML = `<p>Cookies will not be stored</p>`
            if(cookies.get('PrefLang')) {
                cookies.remove('PrefLang', { path:"/" });
            }
        }
        console.log("Cookie consent? " + cookies.get('CookieConsent'));
    }

    render() {
        let userLang = this.props.userLang;

        return <div className="container">
            <div className="header">
                <h1 id="title">{dSettings(5, userLang)}</h1>
            </div>
            <body>
                <div id="CreditsText">
                    <h2>Developers:</h2>
                    <ul>
                        <li>Mitchell Wise</li>
                        <li>Zachary Sutrich</li>
                        <li>Blaze Wiseman</li>
                        <li>Isabelle D’Oleo</li>
                        <li>Ahmad Barhamje</li>
                    </ul>
                    <h2>Translator:</h2><p>Daria Sinyagovskaya</p>
                {
                    !cookies.get('UserID') ? 
                    <>
                    <div id="cookiesConsent" >
                            <h2>Cookies:</h2>
                            <button id="optIn" onClick={() => this.updateCookiePerms(false)}>Opt in</button>
                            <button id="optOut" onClick={() => this.updateCookiePerms(true)}>Opt out</button>
                            <div id="cookiesOptStatus"></div>
                    </div>
                    </>
                    : <></>
                }
                </div>
            </body>
        </div>
    }
}