import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import './EditPaper.css';
import {
    cookies, addPaper, tagExists, addTagToPaper,
    addMetadataTag, getPapersTag, fileURLBase
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

    addTagToList = (tag, tag_id) => {
        const newTags = this.state.currentTags.slice();
        newTags.push({ text: tag, tag_id: tag_id });
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
            if (currentTags[x]["text"] === obj["text"] && currentTags[x]["tag_id"] == obj["tag_id"]) {
                index = x;
                break;
            }
        }
        return index;
    }

    render() {
        const { paperInformation, currentTags, curMetadataText } = this.state;

        const doAddTag = async e => {
            var tag = document.getElementById("tagsearch").value;

            var data = tagExists(tag, cookies.get('PrefLang'), 0);

            if (data.tag_id >= 0) {
                var obj = { text: tag, tag_id: data.tag_id };
                var index = this.findInList(obj, currentTags);
                if (index === -1) {
                    this.addTagToList(tag, data.tag_id);
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

            var data = tagExists(tag, cookies.get('PrefLang'), 0);

            if (data.tag_id >= 0) {
                var obj = { text: tag, tag_id: data.tag_id };
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
                url = "none";
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

            var data = addPaper(metadata_dict);
            var id = data.id;

            var i;
            // for (i = 0; i < tagIDs.length; i++) {
            //     data = addTagToPaper(id, tagIDs[i], 0);
            //     document.getElementById("paperStatus").innerHTML = data.status;
            // }

            //add all metadata as tags
            for (const keyVal in metadata_dict) {
                if (keyVal === "url") continue;
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

            for (const index in field_ids) {
                document.getElementById(field_ids[index]).innerHTML = "";
            }
            document.getElementById("filename").innerHTML = "";

            document.getElementById("paperStatus").innerHTML = "Uploaded Paper";
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
                className="PaperBoxes"
                id={field_ids[index]}
                value={curMetadataText[index]}
                placeholder={placeholderValue}
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
                <div className="PaperBox">
                    <div className="PaperFields">
                        <div id="MetadataFields">
                            {metadata}

                        </div>
                        <hr id="paper_line"></hr>

                        <div id="OtherFields">
                            <h2 id="leftTags">Tags</h2>
                            <input type="text" className="PaperBoxes" id="tags" disabled
                                value={currentTags.map(item => item.text).join(", ")} /><br />
                            <button type="button"
                                className="PaperBoxes"
                                id="addTag"
                                onClick={doAddTag}><div id="addTagBtnTxt">+</div></button>
                            <button type="button"
                                className="PaperBoxes"
                                id="addTag"
                                onClick={doDeleteTag}><div id="addTagBtnTxt">-</div></button>
                            <input type="text" className="PaperBoxes" id="tagsearch" /><br />

                            <br /><br /><br />

                            <form id="uploadForm" method="post" enctype="multipart/form-data">
                                Upload a file:
								<input type="file" name="file" id="paperFile" />
                                <input type="hidden" name="url" id="filename" />
                                {
                                    paperInformation.url !== "none" ?
                                        <div>
                                            <br/>
                                            <a id="currentFile" href={fileURLBase + paperInformation.url} 
                                                target="_blank" >Current File: {paperInformation.url}</a>
                                        </div>
                                        : <div>
                                            <br/>
                                            <a id="currentFile" >Current File: None</a>
                                        </div>
                                }
                                <br/>
                                <input type="submit" name="submit" id="paperSubmit" />
                            </form>

                            <br/>
                            <button type="button" className="PaperBoxes" id="upload" onClick={doAddPaper}><div id="uploadBtnTxt">Upload</div></button>

                        </div>

                    </div>
                </div>
                <div id="paperStatus"></div>
                <button onClick={this.props.closeEdit} >Go Back</button>
            </body>
        </div>
    }
}
