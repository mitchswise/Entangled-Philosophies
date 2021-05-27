import React from 'react';
import {addMetadataTag, tagExists, addTagToPaper } from '../api.js';

function doTagExists() {
    var tagText = document.getElementById('tagText').value;
    var language = document.getElementById('language').value;
    var userID = document.getElementById('userID').value;

    var data = tagExists(tagText, language, userID);
    document.getElementById('tagStatus').innerHTML = "Status: " + data.tag_id;
}

export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 

            <h3>Test tagExists</h3>
            <input id="tagText" placeholder="tag text"></input>
            <input id="language" placeholder="language"></input>
            <input id="userID" placeholder="user ID"></input>
            

            <div id = "tagStatus">Tag Status: </div>
        </div>
        );
        return element; 
    }
}
