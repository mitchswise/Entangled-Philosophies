import React from 'react';
import {addUser, login, sendActivation, resetPassword, 
    supported_languages, addTag, removeTag} from '../api.js';


export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 

            

            <div id = "tagStatus">Tag Status: </div>
        </div>
        );
        return element; 
    }
}
