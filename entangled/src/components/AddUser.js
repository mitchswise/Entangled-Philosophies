import React from 'react';
import { getPapersTag } from '../api.js';

function doGetPapersTag() {
    var paperID = document.getElementById('paperID').value;
    var language = document.getElementById('language1').value;
    var userID = document.getElementById('userID').value;

    var dict = {paperID:paperID, userID:userID, language:language};
    var data = getPapersTag(dict);
    var result = "";
    for(const index in data.tags) {
        result += data.tags[index]["tag_id"] + " : " + data.tags[index]["text"] + " , ";
    }
    document.getElementById('tagStatus').innerHTML = "Status: " + result;
}

export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 

            <h3>Test getPapersTag</h3>
            <input id="paperID" placeholder="paper id"></input>
            <input id="language1" placeholder="language"></input>
            <input id="userID" placeholder="user ID"></input>
            <button onClick={doGetPapersTag}>Submit</button>
            
            <div id="tagStatus">Status: </div>
        </div>
        );
        return element; 
    }
}
