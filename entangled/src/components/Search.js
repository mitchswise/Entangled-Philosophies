import React, { useState } from 'react';
import Filter from './Filter.js';
import {
    cookies, getTags, tagExists, sqlSearch, handleHistory, saveQuery, fileURLBase,
    removeTagFromPaper, addTagToPaper, getWordCloudTags
} from '../api.js'
import { loadTags } from './EditPaper.js';
import Table from "./Table.js";
import QueryPopup from './saveQueryPopup.js';
import EditPaper from './EditPaper.js';
import OptionsPopup from './optionsPopup.js';
import { parseCustomQuery, translateToSQL, isDigit } from './SQLTranslate.js';
import { metadata_ids, metadata_categories } from './UploadPaper.js';
import WordCloud from './WordCloud.js';
import BarChart from './BarChart.js';
import './Search.css';
import { getPermLvl, getGlobalLanguage } from '../api.js';
import { dSettings } from '../dictionary.js';

var userLanguage = getGlobalLanguage();
var userPermLvl = getPermLvl();
var loadedTagData = undefined, loadedTagLanguage = undefined;

//loads all available tags for a user
function getTagData(userLang) {
    if(loadedTagData != undefined && loadedTagLanguage == userLang) return loadedTagData;

    var userID = 0, prefLang = userLang;
    if (cookies.get('UserID')) userID = cookies.get('UserID');
    var result = getTags(userID, prefLang);

    let metadata_ignore = ["17", "23", "32"];
    var tagsList = []

    for (const index in result.tags) {
        const entry = result.tags[index];
        if (!(metadata_ignore.includes(entry["cat_id"])) && entry["frequency"] !== "0") {
            tagsList.push(entry);
        }
    }

    loadedTagData = tagsList;
    loadedTagLanguage = userLang;

    return tagsList;
}

//sets up the filter JSON to be used/updated
//for searching based on filter criteria
function initState(userLang) {
    var categories = [];

    const tagData = getTagData(userLang)
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

function cleanFilterState(filterState, userLang) {
    //because of saved queries before a category is added,
    //we need to make sure filter state is up to date with 
    //all new categories + tags that belong to those new categories

    const newFilter = filterState.slice();
    var textToFilter = {}, tagsSeen = {};

    const tagData = getTagData(userLang);
    tagData.forEach((item, index) => {
        tagsSeen[item.tag_id] = true;
        var foundInFilter = false;
        for (const x in newFilter) {
            if (newFilter[x].row_name == item.cat_id) {
                textToFilter[item.catText] = x;
                foundInFilter = true;
                break;
            }
        }
        if (!foundInFilter) {
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
        if (!(item.tag_id in newFilter[idx])) {
            newFilter[idx][item.tag_id] = 0;
        }
    });
    for (const idx in newFilter) {
        for (const term in newFilter[idx]) {
            if (isDigit(term) && !(term in tagsSeen)) {
                // newFilter[idx].delete(term);
                delete newFilter[idx][term];
            }
        }
    }

    return newFilter;
}

function sendSearchQuery(filterState) {
    var userID = -1;
    if (cookies.get('UserID')) userID = cookies.get('UserID');
    var query = translateToSQL(filterState, userID);

    var result = sqlSearch(userID, query);
    return result;
}

function translateFilterToCustom(filterState) {
    var equation = "";
    for (const index in filterState) {
        var tagsInclude = [];
        var tagsExclude = [];
        var includeState = "AND", excludeState = "AND";

        for (const z in filterState[index]) {
            if (z == "include") {
                includeState = filterState[index][z];
            }
            if (z == "exclude") {
                excludeState = filterState[index][z];
            }
            if (!isDigit(z)) continue;

            if (filterState[index][z] == 1) tagsInclude.push(z);
            else if (filterState[index][z] == 2) tagsExclude.push(z);
        }


        // console.log(tagsInclude.toString() + " and " + tagsExclude.toString())
        if (tagsInclude.length > 0) {
            if (equation.length > 0) equation += " AND ";

            var nextTerm = "";
            for (let curTag in tagsInclude) {
                if (nextTerm.length > 0) nextTerm += " " + includeState + " ";
                nextTerm += "`" + tagsInclude[curTag] + "`";
            }
            nextTerm = "(" + nextTerm + ")";

            equation += nextTerm;
        }

        if (tagsExclude.length > 0) {
            if (equation.length > 0) equation += " AND ";

            var nextTerm = "";
            for (let curTag in tagsExclude) {
                if (nextTerm.length > 0) nextTerm += " " + excludeState + " ";
                nextTerm += "`" + tagsExclude[curTag] + "`";
            }
            nextTerm = "NOT (" + nextTerm + ")";

            equation += nextTerm;
        }
    }
    return equation;
}

export default class Search extends React.Component {

    getExistingFilter = (userLang) => {
        if (!this.props.location || !this.props.location.state
            || !this.props.location.state.filterState) {
            return initState(userLang);
        }
        return cleanFilterState(this.props.location.state.filterState, userLang);
    }
    getExistingPaperData = (userLang) => {
        if (this.props.location && this.props.location.state
            && this.props.location.state.filterState) {
            return sendSearchQuery(cleanFilterState(this.props.location.state.filterState, userLang));
        }
        if (this.props.location && this.props.location.state
            && this.props.location.state.customQuery) {
            if (this.props.location.state.customQuery.has_error) {
                return sendSearchQuery(initState(userLang));
            }
            else {
                var customSearchSQL = this.props.location.state.customQuery.original_input;

                var userID = -1;
                if (cookies.get('UserID')) userID = cookies.get('UserID');
                var result = parseCustomQuery(customSearchSQL, userID);
                return sqlSearch(userID, result.query);
            }
        }
        return sendSearchQuery(initState(userLang));
    }
    getExistingCustomQuery = (userLang) => {
        if (!this.props.location || !this.props.location.state
            || !this.props.location.state.customQuery) {
            return { original_input: undefined };
        }
        return this.props.location.state.customQuery;
    }
    makeInitialOptions = () => {
        var options = {};
        for (const idx in metadata_ids) {
            options[metadata_ids[idx]] = false;
        }
        options["title"] = true;
        options["author"] = true;
        options["language"] = true;

        return options;
    }

    state = {
        tagData: getTagData(this.props.userLang),
        isFilterOpen: false,
        isSaveOpen: false,
        filterState: this.getExistingFilter(this.props.userLang),
        paperData: this.getExistingPaperData(this.props.userLang),
        paperInformation: undefined,
        openEditPaper: false,
        customQuery: this.getExistingCustomQuery(this.props.userLang),
        lastQueryTypeUsed: 0,
        publicTags: [],
        privateTags: [],
        isOptionsOpen: false,
        checkedOptions: this.makeInitialOptions(),
        dataVisualization: 0
    }

    updateHistory = (newFitlerState, userID) => {
        var display_query = translateFilterToCustom(newFitlerState);
        var jsonDict = { owner: userID, is_history: 1, query_text: JSON.stringify(newFitlerState), query_type: "JSON", display_query: display_query };
        saveQuery(jsonDict);
        handleHistory(userID);
    }
    updateCustomHistory = (customSearch, userID) => {
        var jsonDict = { owner: userID, is_history: 1, query_text: customSearch, query_type: "CUSTOM", display_query: customSearch };
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

        var query_text = undefined, query_type = undefined, display_query = undefined;

        if (this.state.lastQueryTypeUsed === 0) {
            query_text = JSON.stringify(this.state.filterState);
            display_query = translateFilterToCustom(this.state.filterState);
            query_type = "JSON";
        }
        else {
            query_text = this.state.customQuery.original_input;
            display_query = this.state.customQuery.display_query;
            query_type = "CUSTOM";
        }

        var is_history = 0;
        var jsonDict = {
            owner: owner, name: queryName, query_text: query_text,
            query_type: query_type, is_history: is_history, display_query: display_query
        };

        saveQuery(jsonDict);

        this.toggleSavePopup();
    }
    handleFilterSave = (newFitlerState, customSearchSQL) => {
        var userID = -1;
        if (cookies.get('UserID')) userID = cookies.get('UserID');

        this.setState((prevState) => ({ dataVisualization: 0 }));

        if (newFitlerState !== undefined) {
            this.setState((prevState) => ({ filterState: newFitlerState }));
            this.closePopup();
            this.setState({ paperData: sendSearchQuery(newFitlerState) });
            this.setState({ lastQueryTypeUsed: 0 });

            if (userID != -1) {
                this.updateHistory(newFitlerState, userID);
            }
        }
        else {
            //custom search!
            var result = parseCustomQuery(customSearchSQL, userID);
            this.closePopup();
            var newPaperData = sqlSearch(userID, result.query);
            this.setState({ paperData: newPaperData });
            this.setState({ lastQueryTypeUsed: 1 });
            this.setState({ customQuery: result });

            if (userID != -1) {
                this.updateCustomHistory(result.display_query, userID);
            }
        }
    }

    loadPaper = (paperInfo) => {
        this.setState((prevState) => ({ paperInformation: paperInfo }));
        this.setState((prevState) => ({ dataVisualization: 0 }));
        var currentTags = loadTags(paperInfo);
        this.setState({ publicTags: currentTags.filter(item => item.owner == 0) });
        this.setState({ privateTags: currentTags.filter(item => item.owner != 0) });
    }
    closePaper = () => {
        this.setState((prevState) => ({ paperInformation: undefined }));
    }

    loadOptions = () => {
        this.setState((prevState) => ({ isOptionsOpen: !prevState.isOptionsOpen }));
    }
    saveOptions = (newOptions) => {
        this.setState((prevState) => ({ isOptionsOpen: !prevState.isOptionsOpen }));
        this.setState((prevState) => ({ checkedOptions: newOptions }));
    }

    updatePrivateTagList = (privateTags, adding) => {
        const { paperInformation } = this.state;
        var newTagText = document.getElementById("addPaperTags").value;
        var userID = cookies.get('UserID');
        var validTag = tagExists(newTagText, userLanguage, userID);
        if (validTag.tag_id < 0) {
            document.getElementById("addPaperTags").value = "";
            return;
        }

        var newTag = { text: newTagText, owner: userID, tag_id: validTag.tag_id };

        var index = -1;
        for (const x in privateTags) {
            if (privateTags[x]["text"] == newTag["text"] && privateTags[x]["tag_id"] == newTag["tag_id"]
                && privateTags[x]["owner"] == newTag["owner"]) {
                index = x;
                break;
            }
        }

        var newPrivateTags = privateTags.slice();

        if (adding) {
            if (index == -1) {
                newPrivateTags.push(newTag);
                addTagToPaper(paperInformation.id, newTag.tag_id, userID);
            }
        }
        else {
            if (index != -1) {
                newPrivateTags.splice(index, 1);
                var dict = { paper_id: paperInformation.id, tag_id: newTag.tag_id, userID: userID };
                removeTagFromPaper(dict);
            }
        }

        this.setState({ privateTags: newPrivateTags });
        document.getElementById("addPaperTags").value = "";
    }

    viewPaper = () => {
        const { paperInformation, privateTags, publicTags } = this.state;
        var userID = 0;
        if (userPermLvl == 0) {
            userID = cookies.get('UserID');
        }

        return <div id="rightBoxWrapper">
            <div id="buttonRow">
                <button id="editPaperButton" onClick={() => { this.setState({ openEditPaper: true }) }}
                    disabled={!cookies.get('UserID') || userPermLvl == 0}>{dSettings(46, this.props.userLang)}</button>
                <button id="closePaperButton" onClick={this.closePaper}>{dSettings(47, this.props.userLang)}</button>
            </div>
            <div class="rightBoxPaperInfo">

                <div id="rowOne">

                    <h3>General Information</h3>

                    <p><b>{dSettings(106,this.props.userLang)}:</b> {paperInformation.title}</p>

                    <p><b>{dSettings(107,this.props.userLang)}:</b> {paperInformation.author}</p>

                </div>

                <div id="rowTwo">

                    <h3>Description Information</h3>

                    <p ><b>{dSettings(110,this.props.userLang)}:</b> {paperInformation.subject}</p>

                    <p ><b>{dSettings(113,this.props.userLang)}:</b> {paperInformation.type}</p>

                    <p ><b>{dSettings(119,this.props.userLang)}:</b> {paperInformation.coverage}</p>

                    <p><b>{dSettings(112,this.props.userLang)}</b> {paperInformation.description}</p>

                </div>

                <div id="rowThree">

                    <h3>Identifying Information</h3>

                    <p><b>{dSettings(71,this.props.userLang)}:</b> {paperInformation.date}</p>

                    <p ><b>{dSettings(114,this.props.userLang)}:</b> {paperInformation.format}</p>

                    <p ><b>{dSettings(115,this.props.userLang)}:</b> {paperInformation.language}</p>

                    <p ><b>{dSettings(121,this.props.userLang)}:</b> {paperInformation.location}</p>

                    <p ><b>{dSettings(120,this.props.userLang)}:</b> {paperInformation.isbn}</p>

                    <p ><b>{dSettings(122,this.props.userLang)}:</b> {
                        paperInformation.paper_url !== null ?
                            <a id="currentFile" href={paperInformation.paper_url}
                                target="_blank" >{paperInformation.paper_url}</a>
                        :
                        ""
                    }</p>

                    <p ><b>File Link:</b> {
                        paperInformation.url !== "none" ?
                            <a id="currentFile" href={fileURLBase + paperInformation.url}
                                target="_blank" >{paperInformation.url}</a>
                            :
                            "None"
                    }</p>

                </div>

                <div id="rowFour">

                    <h3>Legal Information</h3>

                    <p ><b>{dSettings(116,this.props.userLang)}:</b> {paperInformation.source}</p>

                    <p ><b>{dSettings(117,this.props.userLang)}:</b> {paperInformation.publisher}</p>

                    <p ><b>{dSettings(118,this.props.userLang)}:</b> {paperInformation.rights}</p>

                    <p id="rowFourRelation"><b>{dSettings(109,this.props.userLang)}:</b> {paperInformation.relation}</p>

                </div>

                <div id="rowFive">

                    <h3>{dSettings(123,this.props.userLang)}</h3>

                    {
                        userID != 0 ?
                            <>
                                <p ><b>Public:</b> {publicTags.map(item => item.text).join(", ")}</p>
                                <p ><b>Private:</b> {privateTags.map(item => item.text).join(", ")}</p>
                                <div id="searchTagsInput" >
                                    <button onClick={() => this.updatePrivateTagList(privateTags, true)} id="addTagSearchBtnText">+</button>
                                    <button onClick={() => this.updatePrivateTagList(privateTags, false)} id="addTagSearchBtnText">-</button>
                                    <input type="text" placeholder="Enter a valid tag" id="addPaperTags" />
                                </div>
                            </>
                        :
                        <p ><b>Public:</b> {publicTags.map(item => item.text).join(", ")}</p>
                    }

                </div>

            </div>

        </div>
    }

    closeEdit = (didDelete, didUpdate) => {
        if (didUpdate || didDelete) {
            this.setState((prevState) => ({ paperData: sendSearchQuery(prevState.filterState) }));
        }
        if (didDelete) {
            this.setState((prevState) => ({ paperInformation: undefined }));
        }
        this.setState({ openEditPaper: false });
    }

    makeTableColumns = () => {
        const { checkedOptions } = this.state;
        var columns = [];
        for (const idx in metadata_ids) {
            if (checkedOptions[metadata_ids[idx]] == true) {
                columns.push({ Header: metadata_categories[idx], accessor: metadata_ids[idx] });
            }
        }
        return columns;
    }

    loadVisualize = (visual_type) => {
        this.setState((prevState) => ({ paperInformation: undefined }));
        this.setState((prevState) => ({ dataVisualization: visual_type }));
    }

    render() {
        let userLang = this.props.userLang;

        const { isFilterOpen, isSaveOpen, filterState,
            openEditPaper, paperData, paperInformation,
            customQuery, isOptionsOpen, dataVisualization, tagData } = this.state;

        let tableColumns = this.makeTableColumns();

        if (openEditPaper) {
            return <EditPaper paperInformation={paperInformation} closeEdit={this.closeEdit} userLang={userLang} />
        }
        return (<div id="searchContainer">
            <h1 id="title">{dSettings(53, userLang)}</h1>
            <div id="searchBody">
                {isFilterOpen && <Filter
                    handleClose={this.togglePopup}
                    tagData={tagData}
                    filterState={filterState}
                    customQuery={customQuery.original_input}
                    userLang={userLang}
                    handleSave={this.handleFilterSave}
                />}
                {isSaveOpen && <QueryPopup
                    queryType={this.state.lastQueryTypeUsed}
                    handleClose={this.toggleSavePopup}
                    handleSave={this.handleQuerySave}
                    userLang={userLang}
                />}
                {isOptionsOpen && <OptionsPopup
                    loadOptions={this.loadOptions}
                    currentOptions={this.state.checkedOptions}
                    saveOptions={this.saveOptions}
                    userLang={this.props.userLang}
                />}
                <div className="box" id="leftBox">

                    <Table class="tagElement" id="tagTable" columns={tableColumns}
                        data={paperData} loadFilter={this.togglePopup} saveQuery={this.toggleSavePopup}
                        loadPaper={this.loadPaper} loadOptions={this.loadOptions}
                        loadVisualize={this.loadVisualize} userLang={userLang} />

                </div>

                <div className="box" id="rightBox">

                    {
                        paperInformation !== undefined ? this.viewPaper() :
                            dataVisualization === 1 ? <WordCloud userLang={userLang} paperData={paperData} /> :
                                dataVisualization === 2 ? <BarChart userLang={userLang} paperData={paperData} /> :
                                <></>
                    }

                </div>
            </div>
        </div>);
    }
}