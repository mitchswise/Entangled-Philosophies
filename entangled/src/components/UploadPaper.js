import React from 'react';
import { Redirect } from 'react-router-dom';
import './UploadPaper.css';
import { cookies, addPaper, tagExists, addTagToPaper, addMetadataTag } from '../api.js';

export default class UploadPaper extends React.Component {
	componentDidMount() {
		const script = document.createElement("script");
		script.async = true;
		script.src = "../src/UploadSubmit.js";
		this.div.appendChild(script);
	}

    renderRedirect = () => {
        if(cookies.get('UserID') == null) {
            return <Redirect to = '/' />
        }
    }

    render() {		
		let tagsAdded = ""
		let tagsList = []
		let tagIDs = []
		
		const doAddTag = async e => {
			var tag = document.getElementById("tagsearch").value;
			
			var data = tagExists(tag, cookies.get('PrefLang'), 0);
			console.log(data);
			
			if (data.tag_id >= 0)
			{
				tagsAdded = tagsAdded + tag + ', ';
				tagsList.push(tag);
				tagIDs.push(data.tag_id);
				document.getElementById("paperStatus").innerHTML = "";
			}
			else {
				document.getElementById("paperStatus").innerHTML = "Tag Not Found";
			}
			console.log(tagsList);
			
			document.getElementById("tagsearch").value = '';
			document.getElementById("tags").value = tagsAdded;
			
			return;
		}
		
		const doAddPaper = async e => {
			let field_ids = ["titleName", "authorBox", "contributor", "relation", "subject", "date",
				"description", "type", "format", "languageBox", "sourceBox", 
				"publisher", "rights", "coverage", "isbn", "urlBox"];
			let metadata_ids = ["title", "author", "contributor", "relation", "subject", "date",
				"description", "type", "format", "language", "source",
				"publisher", "rights", "coverage", "isbn", "paper_url"];
			let metadata_categories = ["Title", "Author", "Contributor", "Relation", "Subject", "Date",
			"Description", "Type", "Format", "Language", "Source",
			"Publisher", "Rights", "Coverage", "ISBN", "URL"];

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
				url =  document.getElementById("filename").value;
			}

			var metadata_dict = {};
			for(const index in field_ids) {
				var value = document.getElementById(field_ids[index]).value;
				if(value !== "") {
					metadata_dict[metadata_ids[index]] = value;
				}
			}
			metadata_dict["url"] = url;

			var data = addPaper(metadata_dict);
			var id = data.id;
			
			var i;
			for (i = 0; i < tagIDs.length; i++){
				data = addTagToPaper(id, tagIDs[i], 0);
				document.getElementById("paperStatus").innerHTML = data.status;
			}

			//add all metadata as tags
			for(const keyVal in metadata_dict) {
				if(keyVal === "url") continue;
				var value = metadata_dict[keyVal];
				var tag_data = tagExists(value, "met", 0);
				var tag_id = tag_data.tag_id;
				if(tag_id == -1) {

					var found_index = -1;
					for(const index in metadata_ids) {
						if(metadata_ids[index] == keyVal) {
							found_index = index;
							break;
						}
					}

					if(found_index != -1) {
						var curCategory = metadata_categories[found_index];
						var result = addMetadataTag(curCategory, "eng", value, -1);

						tag_data = tagExists(value, "met", 0);
						tag_id = tag_data.tag_id;
					}
					else {
						console.log("error?");
					}

				}

				if(tag_id == -1 || tag_id == undefined) {
					console.log("Error getting metadata tag " + value + " key = " + keyVal);
					continue;
				}

				data = addTagToPaper(id, tag_id, 0);
			}

			for(const index in field_ids) {
				document.getElementById(field_ids[index]).innerHTML = "";
			}
			document.getElementById("filename").innerHTML = "";

			document.getElementById("paperStatus").innerHTML = "Uploaded Paper";
		}
	
        return <div className="container" ref={el => (this.div = el)}>
            <div className="header">
                <h1 id="title">Upload Paper</h1>
            </div>
            {this.renderRedirect()}
            <div className="PaperBox">
                <div className="PaperFields">
					<br /><div id="addPaperStatus"></div>
                    <h2 id="leftTitle">Title</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="titleName" 
					/><br />
                    <h2 id="leftAuthor">Author</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="authorBox"
					 placeholder="Optional Author"
					/><br />
					<h2 id="leftContributor">Contributor</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="contributor"
					 placeholder="Optional Contributor"
					/><br />
					<h2 id="leftRelations">Relation</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="relation"
					 placeholder="Optional Relations"
					/><br />
					<h2 id="leftSubject">Subject</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="subject"
					 placeholder="Optional Subject"
					/><br />
					<h2 id="leftDate">Dates</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="date"
					 placeholder="Optional Date"
					 /><br />
					<h2 id="leftDescription">Description</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="description"
					 placeholder="Optional Description"
					 /><br />
					<h2 id="leftType">Type</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="type"
					 placeholder="Optional Type"
					 /><br />
					<h2 id="leftFormat">Format</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="format"
					 placeholder="Optional Format"
					 /><br />
					<h2 id="leftLanguage">Language</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="languageBox"
					 placeholder="Optional Language"
					 /><br />
					<h2 id="leftSource">Source</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="sourceBox"
					 placeholder="Optional Source"
					 /><br />
					<h2 id="leftPublisher">Publisher</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="publisher"
					 placeholder="Optional Publisher"
					 /><br />
					<h2 id="leftRights">Rights</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="rights"
					 placeholder="Optional Rights"
					 /><br />
					<h2 id="leftCoverage">Coverage</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="coverage"
					 placeholder="Optional Coverage"
					 /><br />
					<h2 id="leftISBN">ISBN</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="isbn"
					 placeholder="Optional ISBN"
					 /><br />
					<h2 id="leftURL">URL</h2>
                    <input type="text" 
					 className="PaperBoxes" 
					 id="urlBox"
					 placeholder="Optional URL"
					 /><br />
					<h2 id="leftTags">Tags</h2>
					<input type="text" className="PaperBoxes" id="tags" disabled/><br />
					<button type="button" 
					 className="PaperBoxes" 
					 id="addTag"
					 onClick={doAddTag}><div id="addTagBtnTxt">+</div></button>
					<input type="text" className="PaperBoxes" id="tagsearch" /><br />

					<br /><br /><br />

					<form id="uploadForm" method="post" enctype="multipart/form-data">
						Upload a file:
						<input type="file" name="file" id="paperFile"/>
						<input type="hidden" name="url" id="filename"/>
						<input type="submit" name="submit" id="paperSubmit"/>
					</form>
					<div id="uploadStatus"></div>

                    <button type="button" className="PaperBoxes" id="upload" onClick={doAddPaper}><div id="uploadBtnTxt">Upload</div></button>

					<div id="paperStatus"></div>

                    <hr id="hr"></hr>
                    

                </div>
            </div>
		</div>
    }
}
