import React from 'react';
import {addUser, login, sendActivation, resetPassword, 
    supported_languages, addTag, removeTag} from '../api.js';

function testFunc() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var language = "eng";

    var data = addUser(username, email, password, language);
	var data2 = sendActivation(username);
    document.getElementById("ansField").innerHTML = ("Status: " + data.status + "\tStatus2: " + data2.status);
}

function testLogin() {
    var username = document.getElementById("loginusername").value;
    var password = document.getElementById("loginpassword").value;

	var data = login(username, password);
	document.getElementById("ansField").innerHTML = ("Status: " + data.UserID);
}

function testResetPassword() {
    var username = document.getElementById("forgot_username").value;
    var email = document.getElementById("forgot_email").value;

    var data = resetPassword(username, email);
    document.getElementById("ansField").innerHTML = ("Status: " + data.status);
}

function testAddTag() {
    var category = document.getElementById("category").value;
    if(!category) {
        document.getElementById("tagStatus").innerHTML = "Please fill out blank sections";
        return;
    }

    var jsonLanguages = '{"category":"' + category + '", ';
    for(const index in supported_languages) {
        var htmlName = "tagname_"+supported_languages[index];
        var value = document.getElementById(htmlName).value;
        if(!value) {
            document.getElementById("tagStatus").innerHTML = "Please fill out blank sections";
            return;
        }
        jsonLanguages += '"' + supported_languages[index] + '":"' + value + '", ';
    }
    jsonLanguages = jsonLanguages.substring(0, jsonLanguages.length - 2) + "}";

    var userID = 0;
    var language = "eng";
    var jsonParse = JSON.parse(jsonLanguages);

    var data = addTag(userID, language, jsonParse);
    document.getElementById("tagStatus").innerHTML = data.status;
}

function testAddUserTag() {
    var category = document.getElementById("categoryUser").value;
    var jsonLanguages = '{"category":"' + category + '", ';
    var value = document.getElementById("tagname_def").value;

    if(!value || !category) {
        document.getElementById("tagStatus").innerHTML = "Please fill out blank sections";
        return;
    }

    jsonLanguages += '"def":"' + value + '", ';
    jsonLanguages = jsonLanguages.substring(0, jsonLanguages.length - 2) + "}";

    var userID = 10;
    var language = "eng";
    var jsonParse = JSON.parse(jsonLanguages);

    var data = addTag(userID, language, jsonParse);
    document.getElementById("tagStatus").innerHTML = data.status;
}

function testRemoveTag() {
    var name = document.getElementById("tagRemoveName").value;
    var lang = document.getElementById("tagRemoveLang").value;
    var user = document.getElementById("tagRemoveUser").value;
    if(!name || !lang || !user) {
        document.getElementById("tagStatus").innerHTML = "Please fill out blank sections";
        return;
    }

    var data = removeTag(name, lang, user);
    document.getElementById("tagStatus").innerHTML = data.status;
}

export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 

            <h3>Forgot Password? Enter username and email</h3>
            <input type="text" id="forgot_username"/><br/>
            <input type="text" id="forgot_email"/><br/>
            <button type="button" id="resetPass" onClick={testResetPassword}>Reset Password</button>

            <h3>Add an Admin tag! Enter category and supply translations in english and german</h3>
            <input type="text" id="category"/><br/>
            <input type="text" id="tagname_eng"/><br/>
            <input type="text" id="tagname_ger"/><br/>
            <button type="button" id="addTag" onClick={testAddTag}>Add Admin tag</button>

            <h3>Add a User tag! Enter category and the name of your tag</h3>
            <input type="text" id="categoryUser"/><br/>
            <input type="text" id="tagname_def"/><br/>
            <button type="button" id="addTag" onClick={testAddUserTag}>Add User tag</button>

            <h3>Remove a tag! Enter the name, its language, and the user id of the owner</h3>
            <input type="text" id="tagRemoveName"/><br/>
            <input type="text" id="tagRemoveLang"/><br/>
            <input type="text" id="tagRemoveUser"/><br/>
            <button type="button" id="removeTag" onClick={testRemoveTag}>Remove tag</button>

            <div id = "tagStatus">Tag Status: </div>
        </div>
        );
        return element; 
    }
}
