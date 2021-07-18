import React, { useState } from "react";
import { dSettings } from "../dictionary";
import './saveQueryPopup.css';

export default class QueryPopup extends React.Component {
    state = {
        queryName: null
    }

    render() {
        return (
            <div className="popup-box">
                <div className="queryBox">
                    <div id="saveWrapper">
                        <div id="topSaveBar">
                            <input id="querySearchBar" placeholder="Query name"
                                onChange= {(e) => { this.setState({queryName:e.target.value}) }} />
                        </div>
                        <div>
                            <p>Saving a {this.props.queryType === 0 ? "Regular" : "Custom"} Query</p>
                        </div>
                        <div id="bottomSaveBar">
                            <button className="bottomSaveButtons" id="querySaveButton" 
                                onClick={() => this.props.handleSave(this.state.queryName)}
                                disabled={!this.state.queryName}
                                >{dSettings(27,this.props.userLang)}</button>
                            <button className="bottomSaveButtons" id="queryCancelButton" 
                                onClick={this.props.handleClose}>{dSettings(44,this.props.userLang)}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}