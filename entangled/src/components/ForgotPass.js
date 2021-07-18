import React from 'react';
import { Redirect } from 'react-router-dom';
import './ForgotPass.css';
import { resetPassword, cookies } from '../api.js';
import { dSettings } from '../dictionary';

function doResetPassword() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("forgotEmail").value;

    if(!username || !email) {
        document.getElementById("resetPasswordStatus").innerHTML = "Please fill out all fields.";
        return;
    }

    var data = resetPassword(username, email);
    document.getElementById("resetPasswordStatus").innerHTML = data.status;
}

export default class ForgotPass extends React.Component {

    renderRedirect = () => {
        if(cookies.get('UserID')) {
            return <Redirect to = '/' />
        }
    }

    render() {
        return <div className="container">
            <div className="header">
                <h1 id="title">{dSettings(132,this.props.userLang)}</h1>
            </div>
            {this.renderRedirect()}
            <div className="ForgotBox">
                <div className="ForgotFields">
                    <h2 id="leftUsername">Username</h2>
                    <input type="text" className="inputBoxes" id="username" /><br />
                    <h2 id="leftPassword">Email</h2>
                    <input type="text" className="inputBoxes" id="forgotEmail" /><br />
                    <button type="button" className="inputBoxes" id="login" onClick={doResetPassword}><div id="loginBtnTxt">{dSettings(65,this.props.userLang)}</div></button>


                    <hr id="hr"></hr>
                </div>
            </div>
            <br /><div id="resetPasswordStatus"></div>
        </div>
    }
}
