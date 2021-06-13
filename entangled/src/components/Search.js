import React, { useState } from 'react';
import Filter from './Filter.js';
import { cookies, getTags, getUserInfo, sqlSearch, handleHistory, saveQuery } from '../api.js'
import Table from "./Table.js";
import QueryPopup from './saveQueryPopup.js';
import EditPaper from './EditPaper.js';
import { parseCustomQuery, translateToSQL } from './SQLTranslate.js';
import './Search.css';

const columnsTags = [
    {
        Header: "Name",
        accessor: "title",
    },
    {
        Header: "Author",
        accessor: "author"
    },
    {
        Header: "Language",
        accessor: "language"
    }
];

//loads all available tags for a user
function getTagData() {
    var userID = 0, prefLang = "eng";
    if (cookies.get('UserID')) userID = cookies.get('UserID');
    if (cookies.get('PrefLang')) prefLang = cookies.get('PrefLang');
    var result = getTags(userID, prefLang);

    let metadata_ignore = ["17", "23", "32"];
    var tagsList = []

    for(const index in result.tags) {
        const entry = result.tags[index];
        if(!(metadata_ignore.includes(entry["cat_id"])) && entry["frequency"] !== "0") {
            tagsList.push(entry);
        }
    }

    return tagsList;
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
        row_state["_expand"] = false;

        for (const tag in categories[x]) {
            row_state[categories[x][tag].tag_id] = 0;
        }
        initState.push(row_state);
    }

    return initState;
}

function cleanFilterState(filterState) {
    //because of saved queries before a category is added,
    //we need to make sure filter state is up to date with 
    //all new categories + tags that belong to those new categories

    const newFilter = filterState.slice();
    var textToFilter = {};

    tagData.forEach((item, index) => {
        var foundInFilter = false;
        for(const x in newFilter) {
            if(newFilter[x].row_name == item.cat_id) {
                textToFilter[item.catText] = x;
                foundInFilter = true;
                break;
            }
        }
        if(!foundInFilter) {
            var row_state = {};
            row_state["row_name"] = item.cat_id;
            row_state["include"] = "OR";
            row_state["exclude"] = "OR";
            row_state["_hidden"] = false;
            row_state["_expand"] = false;

            textToFilter[item.catText] = newFilter.length;
            newFilter.push(row_state);
        }
        const idx = textToFilter[item.catText];
        if(!(item.tag_id in newFilter[idx])) {
            newFilter[idx][item.tag_id] = 0;
        }
    });

    return newFilter;
}

function sendSearchQuery(filterState) {
    var userID = -1;
    if(cookies.get('UserID')) userID = cookies.get('UserID');
    var query = translateToSQL(filterState, userID);

    var result = sqlSearch(userID, query);
    return result;
}

export default class Search extends React.Component {

    getExistingFilter = () => {
        if(!this.props.location || !this.props.location.state
                || !this.props.location.state.filterState) {
            return initState();
        }
        return cleanFilterState(this.props.location.state.filterState);
    }
    getExistingPaperData = () => {
        if(!this.props.location || !this.props.location.state
                || !this.props.location.state.filterState) {
            return sendSearchQuery(initState());
        }
        return sendSearchQuery(cleanFilterState(this.props.location.state.filterState));
    }

    state = {
        isFilterOpen: false,
        isSaveOpen: false,
        filterState: this.getExistingFilter(),
        paperData: this.getExistingPaperData(),
        paperInformation: undefined,
        openEditPaper: false,
        customQuery: undefined,
        lastQueryTypeUsed: 0
    }

    updateHistory = (newFitlerState, userID) => {
        var jsonDict = {owner:userID, is_history:1, query_text:JSON.stringify(newFitlerState), query_type:"JSON"};
        saveQuery(jsonDict);
        handleHistory(userID);
    }
    updateCustomHistory = (customSearch, userID) => {
        var jsonDict = {owner:userID, is_history:1, query_text:customSearch, query_type:"CUSTOM"};
        saveQuery(jsonDict);
        handleHistory(userID);
    }

    togglePopup = () => {
        this.setState((prevState) => ({ isFilterOpen: !prevState.isFilterOpen }));
    }
    closePopup = () => {
        this.setState({ isFilterOpen: false });
    }
    toggleSavePopup = () => {
        this.setState((prevState) => ({ isSaveOpen: !prevState.isSaveOpen }));
    }

    handleQuerySave = (queryName) => {
        var owner = cookies.get('UserID');
        var query_text = JSON.stringify(this.state.filterState);
        var query_type = "JSON"; //will need to change when we add advanced queries
        var is_history = 0;
        var jsonDict = {owner:owner, name:queryName, query_text:query_text, 
            query_type:query_type, is_history:is_history};

        saveQuery(jsonDict);

        this.toggleSavePopup();
    }
    handleFilterSave = (newFitlerState, customSearchSQL) => {
        var userID = -1;
        if(cookies.get('UserID')) userID = cookies.get('UserID');

        if(newFitlerState !== undefined) {
            console.log("Okay..");
            this.setState((prevState) => ({ filterState: newFitlerState }));
            this.closePopup();
            this.setState({ paperData: sendSearchQuery(newFitlerState) });
            this.setState({ lastQueryTypeUsed: 0 });
            
            if(userID != -1) {
                this.updateHistory(newFitlerState, userID);
            }
        }
        else {
            //custom search!
            console.log("Okay! " + customSearchSQL);
            var result = parseCustomQuery("(" + customSearchSQL + ")", userID);
            this.closePopup();
            var newPaperData = sqlSearch(userID, result.query);
            this.setState({ paperData: newPaperData });
            this.setState({ lastQueryTypeUsed: 1 });
            this.setState({ customQuery: customSearchSQL });

            if(userID != -1) {
                this.updateCustomHistory(customSearchSQL, userID);
            }
        }
    }

    loadPaper = (paperInfo) => {
        this.setState((prevState) => ({ paperInformation: paperInfo }));
    }
    closePaper = () => {
        this.setState((prevState) => ({ paperInformation: undefined }));
    }

    viewPaper = () => {
        const { paperInformation } = this.state;
        return <div>
            <div class="rightBoxPaperInfo">
                <h2>Title</h2>         
                <p>{paperInformation.title}</p>
                <h2>Author</h2>
                <p>{paperInformation.author}</p>
                <h2>Language</h2>
                <p>{paperInformation.language}</p>             
            </div>
            
            <button id="editPaperButton" onClick={() => {this.setState({ openEditPaper: true })}}
                disabled={!cookies.get('UserID') || cookies.get('PermLvl') < 1}>Edit Paper</button>
            <button id="closePaperButton" onClick={this.closePaper}>Close Paper</button>
        </div>
    }

    closeEdit = (didDelete, didUpdate) => {
        if(didUpdate || didDelete) {
            var userID = -1;
            if(cookies.get('UserID')) userID = cookies.get('UserID');
            this.setState((prevState) => ({ paperData: sendSearchQuery(prevState.filterState) }));
        }
        if(didDelete) {
            this.setState((prevState) => ({ paperInformation: undefined }));
        }
        this.setState({ openEditPaper: false });
    }

    render() {
        const { isFilterOpen, isSaveOpen, filterState, 
            openEditPaper, paperData, paperInformation,
            customQuery } = this.state;

        if(openEditPaper) {
            return <EditPaper paperInformation={paperInformation} closeEdit={this.closeEdit} />
        }
        return (<div id="searchContainer">
            <h1 id="title">Search</h1>
            <div id="searchBody">
                {isFilterOpen && <Filter
                    handleClose={this.togglePopup}
                    tagData={tagData}
                    filterState={filterState}
                    customQuery={customQuery}
                    handleSave={this.handleFilterSave}
                />}
                {isSaveOpen && <QueryPopup 
                    handleClose = {this.toggleSavePopup}
                    handleSave = {this.handleQuerySave}
                />}
                <div className="box" id="leftBox">

                    <Table class="tagElement" id="tagTable" columns={columnsTags} 
                        data={paperData} loadFilter={this.togglePopup} saveQuery={this.toggleSavePopup}
                        loadPaper={this.loadPaper} />

                </div>

                <div className="box" id="rightBox">

                    {
                        paperInformation !== undefined ? this.viewPaper() : 
                        <></>
                    }

                </div>
            </div>
        </div>);
    }
}