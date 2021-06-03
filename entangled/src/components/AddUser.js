import React from 'react';
import {addMetadataTag, tagExists, addTagToPaper, saveQuery, handleHistory, getQueries, removePaper } from '../api.js';

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

function doSaveQuery() {
    var owner = document.getElementById("qOwner").value;
    var query_type = document.getElementById("qQuery_type").value;
    var is_history = document.getElementById("qHistory").value;
    var query_text = document.getElementById("qQuery_text").value;
    var name = document.getElementById("qName").value;

    var jsonDict = { owner:owner, query_type:query_type, is_history:is_history, query_text:query_text, name:name };
    var data = saveQuery(jsonDict);
    document.getElementById('tagStatus').innerHTML = "Status: " + data.status;
}

function doHandleHistory() {
    var owner = document.getElementById("hOwner").value;
    var data = handleHistory(owner);
    document.getElementById('tagStatus').innerHTML = "Status: " + data.status + " -- " + data.removed_count;
}

function doGetSavedQueries() {
    var owner = document.getElementById("gOwner").value;
    var data = getQueries(owner);
    console.log(data.queries);
}

function doRemovePaper() {
	var id = document.getElementById("rem_paper").value;
	var data = removePaper(id);
	document.getElementById("rem_status").innerHTML = "Status: " + data.status;
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

            <h3>Test addMetadataTag (assumes youre using a valid metadata title)</h3>
            <input id="category" placeholder="category"></input>
            <input id="languageM" placeholder="language"></input>
            <input id="MText" placeholder="text"></input>
            <input id="tag_idM" placeholder="tag id"></input>
            <button onClick={doAddMetadata}>Submit</button>

            <h3>Save a query</h3>
            <input id="qOwner" placeholder="owner"></input>
            <input id="qQuery_type" placeholder="query_type"></input>
            <input id="qHistory" placeholder="is_history"></input>
            <input id="qQuery_text" placeholder="query_text"></input>
            <input id="qName" placeholder="name"></input>
            <button onClick={doSaveQuery}>Submit</button>

            <h3>Remove overflow history</h3>
            <input id="hOwner" placeholder="owner"></input>
            <button onClick={doHandleHistory}>Submit</button>

            <h3>Get all saved queries</h3>
            <input id="gOwner" placeholder="owner"></input>
            <button onClick={doGetSavedQueries}>Submit</button>

            <div id = "tagStatus">Tag Status: </div>

			<h3>Remove a paper</h3>
			<input id="rem_paper" placeholder="id"></input>
			<button onClick={doRemovePaper}>Remove</button>
			<div id="rem_status">Status: </div>

        </div>
        );
        return element; 
    }
}
