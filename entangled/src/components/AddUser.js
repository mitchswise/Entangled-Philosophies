import React from 'react';
import { tagFilter } from '../api.js';

function doTagFilter() {
    let tagIDs = [35];
    var dict = {tags:tagIDs};

    var data = tagFilter(dict);
    // console.log("Done! " + JSON.stringify(data.tags))
}

export default class AddUser extends React.Component {
    render() {
        const element = (
        <div className="container" id="outer-container"> 

            <h3>Test getPapersTag</h3>
            <input id="paperID" placeholder="paper id"></input>
            <input id="language1" placeholder="language"></input>
            <input id="userID" placeholder="user ID"></input>
            <button onClick={doTagFilter}>Submit</button>

            {/* <button onClick={doEditPaper}> Test Edit Paper </button> */}
            
            <div id="tagStatus">Status: </div>
        </div>
        );
        return element; 
    }
}
