import React from "react";
import { cookies, tagFilter } from '../api.js';
import { parseCustomQuery } from './SQLTranslate.js';
import { dSettings } from '../dictionary.js';
import './Filter.css';

const TAG_LIMIT = 10; //Only TAG_LIMIT tags per category unless 'expand' is hit

function getValidTags(forced_tags) {
    var userID = 0;
    if (cookies.get('UserID')) userID = cookies.get('UserID');

    var tagArray = forced_tags.map(item => parseInt(item.id));
    var dict = { tags: tagArray, userID: userID };
    var data = tagFilter(dict);

    var array = [];
    for (const index in data.tags) {
        array.push(parseInt(data.tags[index][0]));
    }
    return array;
}



export default class Popup extends React.Component {
    state = {
        itemList: [],
        textFilter: undefined,
        filterState: JSON.parse(JSON.stringify(this.props.filterState)),
        forced_tags: [],
        forced_state: 0,
        validTags: getValidTags([]),
        isCustomSearch: false,
        customSearchQuery: this.props.customQuery,
        showCustomRules: false
    }

    resetFilter() {
        const newFilter = this.state.filterState.slice();
        for (const index in newFilter) {
            for (const key in newFilter[index]) {
                if (key !== "row_name") {
                    newFilter[index][key] = 0;
                }
            }
            newFilter[index]["_hidden"] = false;
            newFilter[index]["include"] = "OR";
            newFilter[index]["exclude"] = "OR";
        }
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    parseCustomQueryToSQL(equation) {
        var userID = -1;
        if (cookies.get('UserID')) userID = cookies.get('UserID');

        var result = parseCustomQuery(equation, userID);

        if (result.errorMessage !== undefined) {
            document.getElementById("customQueryStatus").innerHTML = "Error: " + result.errorMessage;
            return null;
        }
        else {
            document.getElementById("customQueryStatus").innerHTML = "";
        }
        // console.log("Error: " + result.errorMessage);
        // console.log("Query: " + result.query);

        this.props.handleSave(undefined, equation);
    }

    buttonClick = (e) => {
        var id = e.target.id;
        var tagName = e.target.attributes.value.value
        const { filterState, forced_state, forced_tags } = this.state;
        for (const category in filterState) {
            if (id in filterState[category]) {
                if (forced_state === 0) {
                    const newFilter = filterState.slice(); //copy of state
                    newFilter[category][id] = (newFilter[category][id] + 1) % 3;

                    this.setState((prevState) => ({ filterState: newFilter }));
                }
                else {
                    if (forced_state === 1) {
                        if (forced_tags.indexOf(tagName) === -1) {
                            const newForcedTags = this.state.forced_tags.slice();
                            newForcedTags.push({ name: tagName, id: id });
                            this.setState({ forced_tags: newForcedTags });
                            this.setState({ validTags: getValidTags(newForcedTags) });
                        }
                    }
                    else {
                        var index = -1;
                        for (const idx in forced_tags) {
                            if (forced_tags[idx].id == id) {
                                index = idx;
                                break;
                            }
                        }
                        if (index !== -1) {
                            const newForcedTags = this.state.forced_tags.slice();
                            newForcedTags.splice(index, 1);
                            this.setState({ forced_tags: newForcedTags });
                            this.setState({ validTags: getValidTags(newForcedTags) });
                        }
                    }
                    this.setState({ forced_state: 0 });
                }
                break;
            }
        }
    }

    toggleHide(filterIdx) {
        const newFilter = this.state.filterState.slice(); //copy of state
        newFilter[filterIdx]["_hidden"] = !newFilter[filterIdx]["_hidden"];
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    //Tag ids should only consist of digits and every other entry should have
    //some other character. Meaning if a key is a string of digits, it is a tag.
    isDigit(val) {
        return /^\d+$/.test(val);
    }

    setAllTags(filterIdx, newState) {
        const newFilter = this.state.filterState.slice(); //copy of state
        for (const entry in newFilter[filterIdx]) {
            if (this.isDigit(entry)) {
                newFilter[filterIdx][entry] = newState;
            }
        }
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    setAllView(newView) {
        const newFilter = this.state.filterState.slice(); //copy of state
        for (const index in newFilter) {
            newFilter[index]["_hidden"] = newView;
        }
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    changeInclude(filterIdx, field) {
        const newFilter = this.state.filterState.slice(); //copy of state
        if (newFilter[filterIdx][field] == "OR") newFilter[filterIdx][field] = "AND";
        else newFilter[filterIdx][field] = "OR";
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    flipExpand(filterIdx) {
        const newFilter = this.state.filterState.slice(); //copy of state
        newFilter[filterIdx]["_expand"] = !newFilter[filterIdx]["_expand"];
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    loadData() {
        var categories = {};

        this.state.itemList = [];
        var textToFilter = {};

        const { filterState, validTags } = this.state;


        //processes all tags that match the current filter
        this.props.tagData.forEach((item, index) => {
            // console.log("Hello " + item.text);
            if (!this.state.textFilter || item.text.toLowerCase().includes(this.state.textFilter)) {
                if (!(item.catText in categories)) {
                    categories[item.catText] = [];

                    var foundInFilter = false;
                    for (const x in filterState) {
                        if (filterState[x].row_name == item.cat_id) {
                            textToFilter[item.catText] = x;
                            foundInFilter = true;
                            break;
                        }
                    }
                    if (!foundInFilter) {
                        console.log("Big trouble");
                    }
                }
                categories[item.catText].push(item);
            }
        });

        //for each category that has some matching tags
        for (const x in categories) {
            if (!(x in textToFilter)) continue;

            var tagList = categories[x];
            const filterIndex = textToFilter[x];
            const isHidden = filterState[filterIndex]["_hidden"];
            const includeState = filterState[filterIndex]["include"];
            const excludeState = filterState[filterIndex]["exclude"];
            const isExpanded = filterState[filterIndex]["_expand"];
            //we set up the sections for the html with the proper
            //states and hide the section if necessary

            this.state.itemList.push(<div className="flexcon" id="wrapperFilter">
                <div id="leftcolumnFilter">
                    <p>{x}</p>
                </div>
                <div id="rightcolumnFilter">
                    <button class="filterTopRows" onClick={() => this.flipExpand(filterIndex)} disabled={tagList.length <= TAG_LIMIT} id="viewRow">
                        {isExpanded ? "Shrink" : "Expand"}
                    </button>
                    <button class="filterTopRows" onClick={() => this.setAllTags(filterIndex, 1)} id="viewRow">{dSettings(40,this.props.userLang)}</button>
                    <button class="filterTopRows" onClick={() => this.setAllTags(filterIndex, 0)} id="viewRow">{dSettings(41,this.props.userLang)}</button>
                    <button class="filterTopRows" onClick={() => this.setAllTags(filterIndex, 2)} id="viewRow">{dSettings(42,this.props.userLang)}</button>

                    <button class="filterTopRows" onClick={() => this.changeInclude(filterIndex, "include")} style={{ color: '#337ab7' }}
                        id="viewRow">
                        {includeState == "OR" ? "OR" : "AND"}
                    </button>
                    <button class="filterTopRows" onClick={() => this.changeInclude(filterIndex, "exclude")} style={{ color: '#b73333' }}
                        id="viewRow">
                        {excludeState == "OR" ? "OR" : "AND"}
                    </button>

                    <button class="filterTopRows" onClick={() => this.toggleHide(filterIndex)} id="viewRow">
                        {isHidden == false ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>)

            //button stuff
            if (!isHidden) {
                var curTags = 0;


                for (const tag in tagList) {
                    var curTag = tagList[tag];
                    var tag_id = curTag.tag_id;

                    if (curTags < TAG_LIMIT || isExpanded) {
                        // console.log("? " + JSON.stringify(validTags) + " AND " + tag_id);
                        if (validTags.indexOf(parseInt(tag_id)) === -1) continue;
                        curTags++;

                        const buttonState = filterState[filterIndex][tag_id];
                        this.state.itemList.push(<button id={curTag.tag_id} className="filterButtons"
                            style={
                                buttonState == 0 ? { backgroundColor: '#f0f0f0', color: 'black', borderRadius: 2 } :
                                    buttonState == 1 ? { backgroundColor: '#337ab7', color: 'white', borderRadius: 2 } :
                                        { backgroundColor: '#b73333', color: 'white', borderRadius: 2 }
                            }
                            onClick={this.buttonClick} value={curTag.text} >{curTag.text}</button>)
                    }
                }
            }
            this.state.itemList.push(<hr id="lineSeparator"></hr>)
        }

    }

    updateFilter = e => {
        this.setState((prevState) => ({ textFilter: e.target.value.toLowerCase() || undefined }));
    }

    handleCancel = e => {
        this.setState((prevState) => ({ filterState: this.props.filterState }));
        this.props.handleClose();
    }

    changeForceState = (newState) => {
        const { forced_state } = this.state;
        if (forced_state > 0) {
            this.setState({ forced_state: 0 });
        }
        else {
            this.setState({ forced_state: newState });
        }
    }

    toggleCustomSearch = () => {
        this.setState((prevState) => ({ isCustomSearch: !prevState.isCustomSearch }));
    }

    handleCustomQuery = (e) => {
        this.setState((prevState) => ({ customSearchQuery: e.target.value || undefined }));
    }

    viewCustomRules = () => {
        return (
            <div id="customRulesDiv">
                <h1>Rules:</h1>
                <ul>
                    <li>All tags must be input inbetween a pair of ` characters:
                        <li>Good Example: `XYZ` is valid</li>
                        <li>Bad Example: "XYZ" is not valid</li>
                    </li>
                    <li>
                        Aside from tag input, the only acceptable tokens are:
                        <li>()</li>
                        <li>AND</li>
                        <li>OR</li>
                        <li>NOT</li>
                    </li>
                    <li>
                        "NOT" must be followed by an expression (either a (`XYZ` OR `XYZ2`) or a simple `XYZ2`)
                    </li>
                    <li>
                        "AND" and "OR" must be inbetween 2 valid expressions (`XYZ` AND `XYZ2`) or something like ((`XYZ`) OR (`XYZ2` AND `words`)))
                    </li>
                    <li>
                        Parantheses and tag identifiers must be non-empty. "()" is invalid and "(``)" is also invalid
                    </li>
                    <li>
                        Order of operations:
                        <li>
                            Expressions in () are resolved first
                        </li>
                        <li>
                            "NOT" comes first. Applies to the term directly to the right of the "NOT" token
                        </li>
                        <li>
                            "AND" comes after "NOT". Takes the intersection of the 2 expressions on its left and right
                        </li>
                        <li>
                            "OR" comes last. Takes the union of the 2 expressions on its left and right
                        </li>
                    </li>
                    <li>
                        Example valid expressions:
                        <li>`XYZ`</li>
                        <li>`XYZ` OR `XYZ2`</li>
                        <li>(`XYZ` OR `words`) AND `XYZ2`</li>
                        <li>(`XYZ` AND `XYZ2` OR `words`</li>
                    </li>
                </ul>
            </div>
        )
    }
    toggleRules = () => {
        this.setState((prevState) => ({ showCustomRules: !prevState.showCustomRules }));
    }

    render() {
        const { forced_tags, forced_state, isCustomSearch, customSearchQuery } = this.state;

        if (isCustomSearch) {
            return (
                <div className="popup-box">
                    <div className="filterBox">
                        <input
                            id="customSearchBar"
                            value={customSearchQuery}
                            onChange={this.handleCustomQuery}
                            placeholder={"Custom Query..."}
                        />
                        <div id="customQueryStatus"></div>
                        {/* <div id="customQueryRules">
                            
                            <button onClick={this.toggleRules}>Show Rules</button>
                            {
                                this.state.showCustomRules ?
                                    this.viewCustomRules()
                                    : <></>
                            }

                        </div> */}
                        <div id="customFilterBottomButtons">
                            <button class="filterTopRows" onClick={this.toggleCustomSearch}>Regular</button>
                            <button className="bottomSaveButtonsFilter" id="customFilterSaveButton" onClick={() => this.parseCustomQueryToSQL(customSearchQuery)}>Save</button>
                            <button className="bottomSaveButtonsFilter" id="customFilterCancelButton" onClick={this.handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="popup-box">
                {this.loadData()}
                <div className="filterBox">
                    <div className="flexcon" id="wrapperFilter">
                        <div id="leftcolumnFilter" >
                            <input
                                id="filterSearchBar"
                                onChange={this.updateFilter}
                                placeholder={"Search..."}
                            />
                        </div>
                        <div id="middlecolumnFilter">
                            <input id="tagsDynamicFilter"
                                disabled={true} value={forced_tags.map(item => item.name).join(", ")}
                                placeholder="Tag Filtering..." ></input>
                            <button id="addDynamicFilter"
                                onClick={() => this.changeForceState(1)}
                                style={
                                    forced_state !== 1 ? { backgroundColor: '#f73535' }
                                        : { backgroundColor: '#833535' }
                                }>
                                <div id="addDynamicFilterText">+</div>
                            </button>
                            <button id="addDynamicFilter"
                                onClick={() => this.changeForceState(2)}
                                style={
                                    forced_state !== 2 ? { backgroundColor: '#f73535' }
                                        : { backgroundColor: '#833535' }
                                }>
                                <div id="addDynamicFilterText">-</div>
                            </button>
                        </div>
                        <div id="rightcolumnFilter">
                            <button class="filterTopRows" onClick={this.toggleCustomSearch}>Custom</button>
                            <button class="filterTopRows" onClick={() => this.setAllView(false)} id="viewRow" >{dSettings(35,this.props.userLang)}</button>
                            <button class="filterTopRows" onClick={() => this.setAllView(true)} id="viewRow" >{dSettings(36,this.props.userLang)}</button>
                            <button class="filterTopRows" onClick={() => this.resetFilter()} id="viewRow" >{dSettings(37,this.props.userLang)}</button>
                        </div>
                    </div>
                    <div id="middleBar">
                        {this.state.itemList}
                    </div>
                    <div id="bottomBar">
                        <button className="bottomSaveButtons" id="filterSaveButton" onClick={() => this.props.handleSave(this.state.filterState, undefined)} >{dSettings(43,this.props.userLang)}</button>
                        <button className="bottomSaveButtons" id="filterCancelButton" onClick={this.handleCancel}>{dSettings(44,this.props.userLang)}</button>
                    </div>
                </div>
            </div>
        );
    }
}