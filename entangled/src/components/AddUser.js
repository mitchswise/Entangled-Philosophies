import React from 'react';
import {addMetadataTag, tagExists, addTagToPaper } from '../api.js';

function doTagExists() {
    var tagText = document.getElementById('tagText').value;
    var language = document.getElementById('language').value;
    var userID = document.getElementById('userID').value;

    var data = tagExists(tagText, language, userID);
    document.getElementById('tagStatus').innerHTML = "Status: " + data.tag_id;
}

function doAddTagToPaper() {
    var paper_id = document.getElementById('paper_id').value;
    var tag_id = document.getElementById('tag_id').value;
    var userID = document.getElementById('userIDATTP').value;

    var data = addTagToPaper(paper_id, tag_id, userID);
    document.getElementById('tagStatus').innerHTML = "Status: " + data.status;
}

function doAddMetadata() {
    var category = document.getElementById('category').value;
    var language = document.getElementById('languageM').value;
    var text = document.getElementById('MText').value;
    var tag_id = document.getElementById('tag_idM').value;

    var data = addMetadataTag(category, language, text, tag_id);
    document.getElementById('tagStatus').innerHTML = "Status: " + data.status;
}

export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 

            <h3>Test tagExists</h3>
            <input id="tagText" placeholder="tag text"></input>
            <input id="language" placeholder="language"></input>
            <input id="userID" placeholder="user ID"></input>
            <button onClick={doTagExists}>Submit</button>
            
            <h3>Test addTagToPaper</h3>
            <input id="paper_id" placeholder="paper id"></input>
            <input id="tag_id" placeholder="tag id"></input>
            <input id="userIDATTP" placeholder="user ID"></input>
            <button onClick={doAddTagToPaper}>Submit</button>

            <h3>Test addMetadataTag (assumes you're using a valid metadata title)</h3>
            <input id="category" placeholder="category"></input>
            <input id="languageM" placeholder="language"></input>
            <input id="MText" placeholder="text"></input>
            <input id="tag_idM" placeholder="tag id"></input>
            <button onClick={doAddMetadata}>Submit</button>

            <div id = "tagStatus">Tag Status: </div>
        </div>
        );
        return element; 
    }
}
