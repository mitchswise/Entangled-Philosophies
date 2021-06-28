import React, { useState } from "react";
import './optionsPopup.css';
import { metadata_categories, metadata_ids } from "./UploadPaper";

export default class OptionsPopup extends React.Component {

    state = {
        currentOptions: {...this.props.currentOptions}
    }

    changeCheck = (id) => {
        const newOptions = this.state.currentOptions;
        newOptions[id] = !newOptions[id];
        this.setState({ currentOptions: newOptions });
    }

    makeMetadataBoxes = () => {
        const { currentOptions } = this.state;
        var result = [];
        for(const idx in metadata_categories) {
            var name = metadata_categories[idx];
            var id = "options_"+name;
            result.push(
                <>
                <label class="label" >
                    <input type="checkbox" id={id} checked={currentOptions[metadata_ids[idx]] == true} 
                        onChange={() => this.changeCheck(metadata_ids[idx])} />{name}
                </label>
                </>
            )
        }

        var result_wrap = <div id="metaDataWrapper" >
            {result}
        </div>

        return result_wrap;
    }

    saveOptions = () => {
        var num_checked = 0;

        var dict = {};
        for(const idx in metadata_ids) {
            var elementName = "options_" + metadata_categories[idx];
            var isChecked = document.getElementById(elementName).checked;
            dict[metadata_ids[idx]] = isChecked;
            if(isChecked) num_checked++;
        }

        if(num_checked === 0) {
            window.alert("Please select at least one field to present");
            return;
        }
        this.props.saveOptions(dict);
    }

    render() {
        return (
            <div className="popup-box">
                <div className="optionsBox">

                    <div id="optionBoxes">
                        {this.makeMetadataBoxes()}
                    </div>
                    <div id="optionButtons">
                        <button id="metaDataCancelButton" onClick={this.saveOptions} >Save</button>
                        <button id="metaDataCancelButton" onClick={this.props.loadOptions} >Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}