import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './Admin.css';

export default class Admin extends React.Component {
    render() {
        return <div className="container">
            <div className="header">
                <h1 id="title">Add Admin</h1>
            </div>

            <div className="AdminBox">
                <div className="UserListBox">
                    <h2>Admins</h2>
                    <div id="adminList">
                        <ul>
                            Example Admin 1
                        </ul>
                        <ul>
                            Example Admin 2
                        </ul>
                    </div>
                </div>
                <div className="AddAdminBox">
                    <div class="inputBox">
                        <h2>Username</h2>
                        <input type="text" className="inputBoxes" id="username" /><br />
                    </div>

                    <div>
                        <input type="radio" value="Add" /> Add
                        <input type="radio" value="Remove" /> Remove
                    </div>

                    <button type="button" className="inputBoxes" id="login"><div id="loginBtnTxt">Sumbit</div></button>                    

                </div>
            </div>
        </div>
    }
}
