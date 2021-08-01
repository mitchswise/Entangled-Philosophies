import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import './EditPaper.css';
import { dSettings, wordLookup } from '../dictionary.js';
import trashCan from '../images/trash.png';

import {
    cookies, editPaper, tagExists, addTagToPaper,
    addMetadataTag, removeTagFromPaper, getPapersTag, fileURLBase,
    removePaper, removeFile, HelpVideoURLS
} from '../api.js';
import { field_ids, metadata_ids, metadata_categories } from './UploadPaper';
import { getGlobalLanguage, getPermLvl } from '../api.js';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

var url = 'http://chdr.cs.ucf.edu/~entangledPhilosophy/Entangled-Philosophies/api/uploadPaper.php';
var userID = cookies.get('UserID');
var userLanguage = getGlobalLanguage();
var userPermLvl = getPermLvl();
if (userPermLvl > 0) userID = 0;

let header_ids = ["leftTitle", "leftAuthor", "leftContributor", "leftRelations", "leftSubject", "leftDate",
    "leftDescription", "leftType", "leftFormat", "leftLanguage", "leftSource",
    "leftPublisher", "leftRights", "leftCoverage", "leftISBN", "leftURL", "leftLocation"];

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

export function loadTags(paperInformation) {
    var userID = cookies.get('UserID') ? cookies.get('UserID') : 0, prefLang = getGlobalLanguage(), paperID = paperInformation.id;
    var dict = { userID: userID, language: prefLang, paperID: paperID };
    var data = getPapersTag(dict);

    return data.tags;
}

function doRemoveFile(id, url) {
    var data = removeFile(id, url);
    console.log(data);
}

const doAddPaper = async (paperInformation, currentTags, curMetadataText) => {
    var title = document.getElementById("titleName").value;
    if (title == "") {
        document.getElementById("paperStatus").innerHTML =  dSettings(179, this.props.userLang);
        return;
    }
    var filename = document.getElementById("filename").innerHTML;
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
                    var result = addMetadataTag(curCategory, userLanguage, value, -1);

                    tag_data = tagExists(value, "met", 0);
                    tag_id = tag_data.tag_id;
                }

            }

            if (tag_id == -1 || tag_id == undefined) {
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

}

export default class EditPaper extends React.Component {
    state = {
        paperInformation: this.props.paperInformation,
        curMetadataText: makeMetadataValues(this.props.paperInformation),
        currentTags: loadTags(this.props.paperInformation),
        selectedFile: "",
        isFilePicked: false,
        helpVideo: false
    }

    changeHandler = (event) => {
        if (event.target.files[0].type != "application/pdf") {
            document.getElementById("uploadStatus").innerHTML =  dSettings(181, this.props.userLang);
        } else {
            this.setState({ selectedFile: event.target.files[0] });
            this.setState({ isFilePicked: true });
        }
    };

    removeUpload = () => {
        this.setState({ selectedFile: "" });
        this.setState({ isFilePicked: false });
        document.getElementById("uploadStatus").innerHTML = "";
        document.getElementById("fileUpload").value = "";
    };

    handleSubmission = () => {
        if (this.state.isFilePicked) {
            const formData = new FormData();

            formData.append('file', this.state.selectedFile);

            var jsonObject;

            fetch(url, {
                method: 'POST',
                body: formData
            }).then(response => response.text())
                .then(data => jsonObject = JSON.parse(data))
                .then(json => {
                    document.getElementById("filename").innerHTML = json.url;
                    document.getElementById("uploadStatus").innerHTML = "Uploaded " + json.url + " with status " + json.status;
                    doAddPaper(this.state.paperInformation, this.state.currentTags, this.state.curMetadataText);
                    this.props.closeEdit(false, true);
                });
        } else if (window.confirm(dSettings(178, this.props.userLang))) {
            doAddPaper(this.state.paperInformation, this.state.currentTags, this.state.curMetadataText);
            this.props.closeEdit(false, true);
        }
    };

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

    remFile = () => {
        if (window.confirm("Are you sure you want to delete this file? This action is irreversible.")) {
            let id = this.state.paperInformation.id;
            let url = this.state.paperInformation.url;
            doRemoveFile(id, url);
            var paperInfo = this.state.paperInformation;
            paperInfo.url = "none";
            this.setState({ paperInformation: paperInfo });
        }
    }

    openHelpVideo = () => {
        this.setState((prevState) => ({ helpVideo: !prevState.helpVideo }));
    }


    render() {
        const doAddTag = async e => {
            var tag = document.getElementById("tagsearch").value;

            var data = tagExists(tag, userLanguage, userID);

            if (data.tag_id >= 0) {
                var obj = { text: tag, tag_id: data.tag_id, owner: userID };
                var index = this.findInList(obj, this.state.currentTags);
                if (index === -1) {
                    this.addTagToList(tag, data.tag_id, userID);
                }
                document.getElementById("paperStatus").innerHTML = "";
            }
            else {
                document.getElementById("paperStatus").innerHTML = dSettings(182, this.props.userLang);
            }

            document.getElementById("tagsearch").value = '';

            return;
        }

        const doDeleteTag = async e => {
            var tag = document.getElementById("tagsearch").value;

            var data = tagExists(tag, userLanguage, userID);

            if (data.tag_id >= 0) {
                var obj = { text: tag, tag_id: data.tag_id, owner: userID };
                var index = this.findInList(obj, this.state.currentTags);

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


        let metadata = [];

        const doUpdateArr = async (idx, event) => {
            const nxt = this.state.curMetadataText.slice();
            nxt[idx] = event.target.value;
            this.setState({ curMetadataText: nxt });
        }

        for (let index in field_ids) {
            var curHeader = wordLookup(metadata_categories[index], this.props.userLang);
            var header = <h2 id={header_ids[index]}>{curHeader}</h2>
            var placeholderValue = dSettings(176, this.props.userLang) + " " + curHeader;
            var input = <input
                className="editPaperBoxes"
                id={field_ids[index]}
                value={this.state.curMetadataText[index]}
                placeholder={placeholderValue}
                onChange={doUpdateArr.bind(this, index)} />

            metadata.push(header);
            metadata.push(input);
        }

        return <div className="container" ref={el => (this.div = el)}>
            <div className="header">
                <h1 id="title">{dSettings(46,this.props.userLang)}</h1>
                <div id="iconWrapper" onClick={this.openHelpVideo}>
                    <FontAwesomeIcon icon={faQuestionCircle} id="HomeQuestionCircle" size='2x' />
                </div>
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
                                    value={this.state.currentTags.map(item => item.text).join(", ")} /><br />
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

                                <div id="fileEditDiv">
                                    <input type="file" name="file" id="fileUpload" onChange={this.changeHandler} />
                                    <input type="hidden" id="filename" />
                                    {this.state.isFilePicked ? (
                                        <div>
                                            <p>Size: {this.state.selectedFile.size}</p>
                                        </div>
                                    ) : (
                                        <p>{dSettings(126,this.props.userLang)}</p>
                                    )}
                                    <button type="button" id="clearUploadButton"
                                        onClick={this.removeUpload}>{dSettings(127,this.props.userLang)}</button>
                                </div>


                                <div id="uploadStatus"></div>

                            </div>
                            {
                                this.state.paperInformation.url !== "none" ?
                                    <div>
                                        <br />
                                        <a id="currentFile" href={fileURLBase + this.state.paperInformation.url}
                                            target="_blank" >{dSettings(197, this.props.userLang)}: {this.state.paperInformation.url}</a>
                                        <br /><button type="button" id="removeCurrentFile" onClick={this.remFile}>Remove Current File</button>
                                    </div>
                                    : <div>
                                        <br />
                                        <a id="currentFile" >{dSettings(197, this.props.userLang)}: {dSettings(42, this.props.userLang)}</a>
                                    </div>
                            }

                        </div>
                    </div>
                    <div id="bottomRowButtons">
                        <button type="button" className="editSaveButtons" id="editSaveButton" onClick={this.handleSubmission}>{dSettings(27, this.props.userLang)}</button>
                        <button type="button" className="editSaveButtons" id="editCancelButton"
                            onClick={() => this.props.closeEdit(false, false)}>{dSettings(44, this.props.userLang)}</button>
                        <img src={trashCan} id="deletePaperButton" onClick={() => {
                            var phrase = dSettings(198, this.props.userLang)
                            if (window.confirm(phrase)) {
                                removePaper(this.state.paperInformation.id);
                                this.props.closeEdit(true, false);
                            }
                        }} />
                    </div>
                    <div id="paperStatus"></div>
                </div>
                <div id="extrDiv">
                    <Dialog open={this.state.helpVideo} onClose={this.openHelpVideo}>
                        <DialogContent>
                            <iframe width="560" height="315" src={HelpVideoURLS[0]} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.openHelpVideo}
                                color="primary" autoFocus>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </body>
        </div>
    }
}
