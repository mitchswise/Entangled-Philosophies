import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Filter from './Filter.js';
import { cookies, getTags } from '../api.js'


//loads all available tags for a user
function getTagData() {
    var userID = 0;
    if(cookies.get('UserID')) userID = cookies.get('UserID');
    var result = getTags(userID, "eng");
    
    return result.tags;
}
const tagData = getTagData();

function initState() {
    var categories = [];
    tagData.forEach((item, index) => {
        if(!(item.catText in categories)) {
            categories[item.catText] = [];
        }
        categories[item.catText].push(item);
    });
    
    var initState = [];
    for(const x in categories) {
        var row_state = {};
        var cat_id = categories[x][0].cat_id;
        row_state["row_name"] = cat_id;
        
        row_state["include"] = "OR";
        row_state["exclude"] = "OR";
        row_state["_hidden"] = false;
        
        for(const tag in categories[x]) {
            row_state[categories[x][tag].tag_id] = 0;
        }
        initState.push(row_state);
    }
    
    return initState;
}

export default class DummySearch extends React.Component {
    
    state = {
        isOpen: false,
        filterState: initState()
    }

    togglePopup = () => {
        
        this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
    }
    handleFilterSave = (newFitlerState) => {
        this.setState((prevState) => ({ filterState: newFitlerState }));
        this.togglePopup();
    }

    render() {
        const { isOpen, filterState } = this.state;
        return (<div className="container">
            <div className="header">
                <h1 id="title">Search</h1>
            </div>
            <div>
                <input
                    type="button"
                    value="Click to Open Popup"
                    onClick={this.togglePopup}
                />
                {isOpen && <Filter
                    handleClose={this.togglePopup}
                    tagData={tagData}
                    filterState={filterState}
                    handleSave={this.handleFilterSave}
                />}
            </div>
        </div>);
    }
}