import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './EditPaper.css';
import trashCan from '../images/trash.png';

import {
    cookies, editPaper, tagExists, addTagToPaper,
    addMetadataTag, removeTagFromPaper, getPapersTag, fileURLBase,
    removePaper
} from '../api.js';

let field_ids = ["titleName", "authorBox", "contributor", "relation", "subject", "date",
    "description", "type", "format", "languageBox", "sourceBox",
    "publisher", "rights", "coverage", "isbn", "urlBox"];
let metadata_ids = ["title", "author", "contributor", "relation", "subject", "date",
    "description", "type", "format", "language", "source",
    "publisher", "rights", "coverage", "isbn", "paper_url"];
let metadata_categories = ["Title", "Author", "Contributor", "Relation", "Subject", "Date",
    "Description", "Type", "Format", "Language", "Source",
    "Publisher", "Rights", "Coverage", "ISBN", "URL"];
let header_ids = ["leftTitle", "leftAuthor", "leftContributor", "leftRelations", "leftSubject", "leftDate",
    "leftDescription", "leftType", "leftFormat", "leftLanguage", "leftSource",
    "leftPublisher", "leftRights", "leftCoverage", "leftISBN", "leftURL"];

function makeMetadataValues(paperInformation) {
    var curMetadataText = [];
    for (let index in metadata_ids) {
        var startValue = "";
        if (paperInformation[metadata_ids[index]] !== null) {
            startValue = paperInformation[metadata_ids[index]];
        }
        curMetadataText.push(startValue);
    }
    return curMetadataText;
}

function loadTags(paperInformation) {
    var userID = cookies.get('UserID');
    var prefLang = cookies.get('PrefLang');
    var paperID = paperInformation.id;
    if (cookies.get('PermLvl') > 0) userID = 0;

    var dict = { userID: userID, language: prefLang, paperID: paperID };
    var data = getPapersTag(dict);

    return data.tags;
}

export default class EditPaper extends React.Component {

    state = {
        paperInformation: this.props.paperInformation,
        curMetadataText: makeMetadataValues(this.props.paperInformation),
        currentTags: loadTags(this.props.paperInformation),

    }

    componentDidMount() {
        const script = document.createElement("script");
        script.async = true;
        script.src = "../src/UploadSubmit.js";
        this.div.appendChild(script);
    }

    renderRedirect = () => {
        if (cookies.get('UserID') == null) {
            return <Redirect to='/' />
        }
    }

    addTagToList = (tag, tag_id, owner) => {
        const newTags = this.state.currentTags.slice();
        newTags.push({ text: tag, tag_id: tag_id, owner: owner });
        this.setState({ currentTags: newTags });
    }
    removeTagFromList = (index) => {
        const newTags = this.state.currentTags.slice();
        newTags.splice(index, 1);
        this.setState({ currentTags: newTags });
    }
    findInList = (obj, currentTags) => {
        var index = -1;
        for (const x in currentTags) {
            if (currentTags[x]["text"] == obj["text"] && currentTags[x]["tag_id"] == obj["tag_id"]
                && currentTags[x]["owner"] == obj["owner"]) {
                index = x;
                break;
            }
        }
        return index;
    }

    render() {
        const { paperInformation, currentTags, curMetadataText } = this.state;
        var userID = cookies.get('UserID');
        if (cookies.get('PermLvl') > 0) userID = 0;

        const doAddTag = async e => {
            var tag = document.getElementById("tagsearch").value;

            var data = tagExists(tag, cookies.get('PrefLang'), userID);

            if (data.tag_id >= 0) {
                var obj = { text: tag, tag_id: data.tag_id, owner: userID };
                var index = this.findInList(obj, currentTags);
                if (index === -1) {
                    this.addTagToList(tag, data.tag_id, userID);
                }
                document.getElementById("paperStatus").innerHTML = "";
            }
            else {
                document.getElementById("paperStatus").innerHTML = "Tag Not Found";
            }

            document.getElementById("tagsearch").value = '';

            return;
        }

        const doDeleteTag = async e => {
            var tag = document.getElementById("tagsearch").value;

            var data = tagExists(tag, cookies.get('PrefLang'), userID);

            if (data.tag_id >= 0) {
                var obj = { text: tag, tag_id: data.tag_id, owner: userID };
                var index = this.findInList(obj, currentTags);

                if (index > -1) {
                    this.removeTagFromList(index);
                }

                document.getElementById("paperStatus").innerHTML = "";
            }
            else {
                document.getElementById("paperStatus").innerHTML = "Tag Not Found";
            }

            document.getElementById("tagsearch").value = '';
            return;
        }

        const doAddPaper = async e => {
            var title = document.getElementById("titleName").value;
            if (title == "") {
                document.getElementById("paperStatus").innerHTML = "Paper must include a title";
                return;
            }
            var filename = document.getElementById("filename").value;
            var url;

            if (filename == "") {
                url = paperInformation.url;
            } else {
                url = filename;
            }

            var metadata_dict = {};
            for (const index in field_ids) {
                var value = document.getElementById(field_ids[index]).value;
                if (value !== "") {
                    metadata_dict[metadata_ids[index]] = value;
                }
                else {
                    metadata_dict[metadata_ids[index]] = "";
                }
            }
            metadata_dict["url"] = url;
            metadata_dict["id"] = paperInformation.id;

            var data = editPaper(metadata_dict);
            var id = paperInformation.id;

            //delete all tags from the current paper owner by current user
            // and then add all current tags made by current user
            const oldTags = loadTags(paperInformation);
            for (let i = 0; i < oldTags.length; i++) {
                if (oldTags[i]["owner"] == userID) {
                    var dict = { tag_id: oldTags[i]["tag_id"], paper_id: paperInformation.id, userID: userID }
                    removeTagFromPaper(dict);
                }
            }
            for (let i = 0; i < currentTags.length; i++) {
                if (currentTags[i]["owner"] == userID) {
                    var paper_id = paperInformation.id
                    var tag_id = currentTags[i]["tag_id"]
                    addTagToPaper(paper_id, tag_id, userID);
                }
            }

            if (userID == 0) {
                for (const value in paperInformation) {
                    if (metadata_ids.indexOf(value) !== -1) {
                        if (paperInformation[value] != null) {
                            var tag_data = tagExists(paperInformation[value], "met", 0);
                            if (tag_data.tag_id >= 0) {
                                var dict = { userID: 0, paper_id: paperInformation.id, tag_id: tag_data.tag_id }
                                removeTagFromPaper(dict);
                            }

                        }
                    }
                }

            }

            if (userID == 0) {
                //add all metadata as tags
                for (const keyVal in metadata_dict) {
                    if (metadata_ids.indexOf(keyVal) < 0 || metadata_dict[keyVal] === "") continue;
                    var value = metadata_dict[keyVal];
                    var tag_data = tagExists(value, "met", 0);
                    var tag_id = tag_data.tag_id;
                    if (tag_id == -1) {

                        var found_index = -1;
                        for (const index in metadata_ids) {
                            if (metadata_ids[index] == keyVal) {
                                found_index = index;
                                break;
                            }
                        }

                        if (found_index != -1) {
                            var curCategory = metadata_categories[found_index];
                            var result = addMetadataTag(curCategory, "eng", value, -1);

                            tag_data = tagExists(value, "met", 0);
                            tag_id = tag_data.tag_id;
                        }
                        else {
                            console.log("error?");
                        }

                    }

                    if (tag_id == -1 || tag_id == undefined) {
                        console.log("Error getting metadata tag " + value + " key = " + keyVal);
                        continue;
                    }

                    data = addTagToPaper(id, tag_id, 0);
                }
            }

            for (const index in field_ids) {
                document.getElementById(field_ids[index]).innerHTML = "";
            }
            document.getElementById("filename").innerHTML = "";

            document.getElementById("paperStatus").innerHTML = "Uploaded Paper";

            this.props.closeEdit(false, true);
        }


        let metadata = [];

        const doUpdateArr = async (idx, event) => {
            const nxt = curMetadataText.slice();
            nxt[idx] = event.target.value;
            this.setState({ curMetadataText: nxt });
        }

        for (let index in field_ids) {
            var curHeader = metadata_categories[index];
            var header = <h2 id={header_ids[index]}>{curHeader}</h2>
            var placeholderValue = "Optional " + metadata_categories[index];
            var input = <input
                className="editPaperBoxes"
                id={field_ids[index]}
                value={curMetadataText[index]}
                placeholder={placeholderValue}
                disabled={cookies.get('PermLvl') < 1}
                onChange={doUpdateArr.bind(this, index)} />

            metadata.push(header);
            metadata.push(input);
        }

        return <div className="container" ref={el => (this.div = el)}>
            <div className="header">
                <h1 id="title">Edit Paper</h1>
            </div>
            {this.renderRedirect()}
            <body>
                <div id="editPaperWrapper">
                    <div className="editPaperBox">
                        <div className="editPaperFields">
                            <div id="MetadataFields">
                                {metadata}

                            </div>
                            <hr id="paper_line"></hr>

                            <div id="OtherFields">
                                <h2 id="leftTags">Tags</h2>
                                <input type="text" className="editPaperBoxes" id="tags" disabled
                                    value={currentTags.map(item => item.text).join(", ")} /><br />
                                <button type="button"
                                    className="editPaperBoxes"
                                    id="addTag"
                                    onClick={doAddTag}><div id="addTagBtnTxt">+</div></button>
                                <button type="button"
                                    className="editPaperBoxes"
                                    id="addTag"
                                    onClick={doDeleteTag}><div id="addTagBtnTxt">-</div></button>
                                <input type="text" className="editPaperBoxes" id="tagsearch" /><br />

                                <br /><br /><br />

                                <form id="uploadForm" method="post" enctype="multipart/form-data">
                                    Upload a file:
								<input type="file" name="file" id="paperFile" />
                                    <input type="hidden" name="url" id="filename" />
                                    {
                                        paperInformation.url !== "none" ?
                                            <div>
                                                <br />
                                                <a id="currentFile" href={fileURLBase + paperInformation.url}
                                                    target="_blank" >Current File: {paperInformation.url}</a>
                                            </div>
                                            : <div>
                                                <br />
                                                <a id="currentFile" >Current File: None</a>
                                            </div>
                                    }
                                    <br />
                                    <input type="submit" name="submit" id="paperSubmit" />
                                </form>

                            </div>

                        </div>
                    </div>
                    <div id="bottomRowButtons">
                        <button type="button" className="editSaveButtons" id="editSaveButton" onClick={doAddPaper}>Save</button>
                        <button type="button" className="editSaveButtons" id="editCancelButton" 
                            onClick={() => this.props.closeEdit(false, false)}>Cancel</button>
                        <img src={trashCan}  id="deletePaperButton" onClick={() => {
                            if(cookies.get('PermLvl') < 1) {
                                window.alert("Regular users can't delete papers.")
                            }
                            else if (window.confirm("Are you sure you want to delete this paper? This action is irreversible!")) {
                                console.log("Deleting...");
                                removePaper(paperInformation.id);
                                this.props.closeEdit(true, false);
                            }
                        }} />
                    </div>
                    <div id="paperStatus"></div>
                </div>
            </body>
        </div>
    }
}
