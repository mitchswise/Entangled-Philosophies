import React, { useState } from 'react';
import Filter from './Filter.js';
import { cookies, getTags } from '../api.js'
import Table from "./Table.js";
import './Search.css';

const columnsTags = [
    {
        Header: "Tag",
        accessor: "text"
    },
    {
        Header: "Category",
        accessor: "catText"
    }
];

//loads all available tags for a user
function getTagData() {
    var userID = 0;
    if (cookies.get('UserID')) userID = cookies.get('UserID');
    var result = getTags(userID, "eng");

    return result.tags;
}
const tagData = getTagData();

//sets up the filter JSON to be used/updated
//for searching based on filter criteria
function initState() {
    var categories = [];
    tagData.forEach((item, index) => {
        if (!(item.catText in categories)) {
            categories[item.catText] = [];
        }
        categories[item.catText].push(item);
    });

    var initState = [];
    for (const x in categories) {
        var row_state = {};
        var cat_id = categories[x][0].cat_id;
        row_state["row_name"] = cat_id;

        row_state["include"] = "OR";
        row_state["exclude"] = "OR";
        row_state["_hidden"] = false;

        for (const tag in categories[x]) {
            row_state[categories[x][tag].tag_id] = 0;
        }
        initState.push(row_state);
    }

    return initState;
}

export default class Search extends React.Component {

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
        return (<div id="searchContainer">
            <h1 id="title">Search</h1>
            <div id="searchBody">
                {isOpen && <Filter
                    handleClose={this.togglePopup}
                    tagData={tagData}
                    filterState={filterState}
                    handleSave={this.handleFilterSave}
                />}
                <div className="box" id="leftBox">

                    <Table class="tagElement" id="tagTable" columns={columnsTags} 
                        data={tagData} loadFilter={this.togglePopup} />

                </div>

                <div className="box" id="rightBox">


                </div>
            </div>
        </div>);
    }
}