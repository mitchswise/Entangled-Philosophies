import React from 'react';
import { cookies } from '../api';
import { dSettings } from '../dictionary';
import './About.css';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default class About extends React.Component {

    state = {
        helpVideo: false
    }

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
    }

    openHelpVideo = () => {
        this.setState((prevState) => ({ helpVideo: !prevState.helpVideo }));
    }

    render() {
        let userLang = this.props.userLang;

        return <div className="container">
            <div className="header">
                <h1 id="title">{dSettings(5, userLang)}</h1>
                <div id="iconWrapper" onClick={this.openHelpVideo}>
                    <FontAwesomeIcon icon={faQuestionCircle} id="HomeQuestionCircle" size='2x' />
                </div>
            </div>
            <body>
                <div id="CreditsText">
                    <h2>{dSettings(133,this.props.userLang)}:</h2>
                    <ul>
                        <li>Mitchell Wise</li>
                        <li>Zachary Sutrich</li>
                        <li>Blaze Wiseman</li>
                        <li>Isabelle D’Oleo</li>
                        <li>Ahmad Barhamje</li>
                    </ul>
                    <h2>{dSettings(134,this.props.userLang)}:</h2><p>Daria Sinyagovskaya</p>
                {
                    !cookies.get('UserID') ? 
                    <>
                    <div id="cookiesConsent" >
                            <h2>{dSettings(88,this.props.userLang)}:</h2>
                            <button id="optIn" onClick={() => this.updateCookiePerms(false)}>{dSettings(91,this.props.userLang)}</button>
                            <button id="optOut" onClick={() => this.updateCookiePerms(true)}>{dSettings(92,this.props.userLang)}</button>
                            <div id="cookiesOptStatus"></div>
                    </div>
                    </>
                    : <></>
                }
                </div>
                <div id="extrDiv">
                    <Dialog open={this.state.helpVideo} onClose={this.openHelpVideo}>
                        <DialogContent>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.openHelpVideo}
                                color="primary" autoFocus>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </body>
        </div>
    }
}