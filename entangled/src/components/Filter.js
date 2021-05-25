import React, { useState } from "react";
import './Filter.css';

export default class Popup extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            someBool: false,
            textFilter: undefined,
            filterState: this.props.filterState
        }
    }

    buttonClick = e => {
        var id = e.target.id;
        const { filterState } = this.state;
        for(const category in filterState) {
            if(id in filterState[category]) {
                const newFilter = filterState.slice(); //copy of state
                newFilter[category][id] = (newFilter[category][id]+1)%3;

                this.setState((prevState) => ({ filterState: newFilter }));
                break;
            }
        }
    }

    toggleHide(filterIdx) {
        const newFilter = this.state.filterState.slice(); //copy of state
        newFilter[filterIdx]["_hidden"] = !newFilter[filterIdx]["_hidden"];
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    //Tags should only consist of digits and every other entry should have
    //some other character. Meaning if a key is a string of digits, it is a tag.
    isDigit(val) {
        return /^\d+$/.test(val);
    }

    setAllTags(filterIdx, newState) {
        const newFilter = this.state.filterState.slice(); //copy of state
        for(const entry in newFilter[filterIdx]) {
            if(this.isDigit(entry)) {
                newFilter[filterIdx][entry] = newState;
            }
        }
        this.setState((prevState) => ({ filterState: newFilter }));
    }

    loadData() {
        var categories = {};

        this.state.itemList = [];
        var textToFilter = {};

        const { filterState } = this.state;

        this.props.tagData.forEach((item, index) => {
            if(!this.state.textFilter ||  item.text.toLowerCase().includes(this.state.textFilter)) {
                if(!(item.catText in categories)) {
                    categories[item.catText] = [];
                    for(const x in filterState) {
                        if(filterState[x].row_name == item.cat_id) {
                            textToFilter[item.catText] = x;
                            break;
                        }
                    }
                }
                categories[item.catText].push(item);
            }
        });

        for(const x in categories) {

            var tagList = categories[x];
            const filterIndex = textToFilter[x];
            const isHidden = filterState[filterIndex]["_hidden"];

            this.state.itemList.push(<div className="flexcon" id="wrapperFilter">
                <div id="leftcolumnFilter"> 
                    <p>{x}</p>
                </div>
                <div id="rightcolumnFilter"> 
                    <button onClick={() => this.setAllTags(filterIndex, 1)} id="viewRow">All</button>
                    <button onClick={() => this.setAllTags(filterIndex, 0)} id="viewRow">Clear</button>
                    <button onClick={() => this.setAllTags(filterIndex, 2)} id="viewRow">None</button>
                    <button id="viewRow">OR</button>
                    <button id="viewRow">OR</button>
                    <button onClick={() => this.toggleHide(filterIndex)} id="viewRow">
                        {isHidden == false ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>)

            //button stuff
            if(!isHidden) {
                for(const tag in tagList) {
                    var curTag = tagList[tag];
                    var tag_id = curTag.tag_id;
    
                    const buttonState = filterState[filterIndex][tag_id];
                    this.state.itemList.push(<button id={curTag.tag_id} 
                        style={
                            buttonState == 0 ? { backgroundColor: '#f0f0f0', color: 'black', borderRadius: 2 } :
                            buttonState == 1 ? { backgroundColor: '#337ab7', color: 'white', borderRadius: 2 } : 
                            { backgroundColor: '#b73333', color: 'white', borderRadius: 2 }
                        }
                        onClick={this.buttonClick} >{curTag.text}</button>)
                }
            }
            // this.state.itemList.push(<hr id="lineSeparator"></hr>)
        }

    }

    updateFilter = e => {
        this.setState((prevState) => ({ textFilter: e.target.value.toLowerCase() || undefined }));
    }

    render() {
        return (
            <div className="popup-box">
                {this.loadData()}
                <div className="box">
                    <div id="topBar">
                    <input
                        id="tagsSearchBar"
                        onChange={this.updateFilter}
                        placeholder={"Search name"}
                    />
                    </div>
                    <div id="middleBar">
                        {this.state.itemList}
                    </div>
                    <div id="bottomBar">
                        <button>Save</button>
                        <button onClick={this.props.handleClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}