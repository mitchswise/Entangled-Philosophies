import React from 'react';
import { cookies } from '../api';
import { dSettings } from '../dictionary';

export default class About extends React.Component {

    updateCookiePerms = (removeCookie) => {
        if(!removeCookie) {
            cookies.set('CookieConsent', "true");
        }
        else {
            cookies.set('CookieConsent', "false");
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
                <h1 id="title">{dSettings(28, userLang)}</h1>
            </div>
            <body>
                {
                    !cookies.get('UserID') ? 
                        <div class="cookies" style={{float:"left"}}>
                            <button id="optIn" onClick={() => this.updateCookiePerms(false)}>Opt in</button>
                            <button id="optOut" onClick={() => this.updateCookiePerms(true)}>Opt out</button>
                        </div>
                    : <></>
                }
            </body>
        </div>
    }
}