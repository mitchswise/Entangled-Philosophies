import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import './UploadPaper.css';
import { cookies, addPaper, tagExists, addTagToPaper, addMetadataTag, tagExistsBatch, addTagBatch, addTagToPaperBatch, paperExists } from '../api.js';

var tagsList = [];	
var tagIDs = [];
var url = 'http://chdr.cs.ucf.edu/~entangledPhilosophy/Entangled-Philosophies/api/uploadPaper.php';

export const field_ids = ["titleName", "authorBox", "contributor", "relation", "subject", "date",
"description", "type", "format", "languageBox", "sourceBox",
"publisher", "rights", "coverage", "isbn", "urlBox", "location"];

export const metadata_ids = ["title", "author", "contributor", "relation", "subject", "date",
"description", "type", "format", "language", "source",
"publisher", "rights", "coverage", "isbn", "paper_url", "location"];

export const metadata_categories = ["Title", "Author", "Contributor", "Relation", "Subject", "Date",
"Description", "Type", "Format", "Language", "Source",
"Publisher", "Rights", "Coverage", "ISBN", "URL", "Location"];

export function addSpreadsheetPaper(dict) {
	var response = {success:false, error:undefined};

	var metadata_dict = {};
	var tagsList = [];

	for(const key in dict) {
		var new_key = key.toLowerCase();
		if(new_key == "url") new_key = "paper_url";
		if(new_key.trim().length == 0) continue;

		if(new_key == "manual tags") {
			tagsList = dict[key].split(";");
		}
		else {
			metadata_dict[new_key] = dict[key];
		}
	}

	if(!("title" in metadata_dict)) {
		response.error = "Missing title";
		return response;
	}

	//check for duplicate (title,author) pair?
	if(("author" in metadata_dict)) {
		var doesExist = paperExists(metadata_dict["title"], metadata_dict["author"]);
		if(doesExist.exists == true) {
			response.error = "Duplicate paper being inserted.";
			return response;
		}
	}

	metadata_dict["url"] = "none";

	var addPaperData = addPaper(metadata_dict);
	var paper_id = addPaperData.id;

	//figure out existence of all tags
	var tagsToPass = [];
	for(const idx in tagsList) {
		tagsToPass.push({text: tagsList[idx]});
	}
	for(const key in metadata_dict) {
		if(key == "url") continue;
		tagsToPass.push({ text: metadata_dict[key] });
	}

	//assumptions made because we're in 'add spreadsheet paper'
	var jsonDict = { tagsArray:tagsToPass, userID:0, language:"eng" };
	var data = tagExistsBatch(jsonDict);

	//find any missing tags and add them to the database
	var tagsToAdd = [];

	for(const idx in tagsList) {
		if(data.tags[ tagsList[idx] ] == "-1") {
			var category = "General";
			var eng = tagsList[idx];
			var ger = tagsList[idx] + " - needs German translation";
			tagsToAdd.push({ category:category, eng:eng, ger:ger });
		}
	}

	for(const key in metadata_dict) {
		if(key == "url") continue;
		if(data.tags[ metadata_dict[key] ] == "-1") {
			var category = "";
			if(key == "paper_url") category = "URL";
			else category = key.charAt(0).toUpperCase() + key.slice(1);

			var met = metadata_dict[key];

			tagsToAdd.push({ category:category, met:met });
		}
	}

	console.log("Tags to add: " + JSON.stringify(tagsToAdd));

	if(tagsToAdd.length > 0) {
		jsonDict = {userID: 0, language: "eng", tagsArray:tagsToAdd};
		console.log("dict passed: " + JSON.stringify(jsonDict));
		data = addTagBatch(jsonDict);
	}

	//now all the tags exist. Get their IDs by recalling tagExists
	jsonDict = { tagsArray:tagsToPass, userID:0, language:"eng" };
	data = tagExistsBatch(jsonDict);

	console.log("Do all tags exist? " + JSON.stringify(data));

	//add all these existing tags to a paper
	var tagToPaper = [];
	for(const idx in tagsList) {
		var tag_id = data.tags[ tagsList[idx] ];
		if(tag_id == "-1") {
			response.error = "Tags not added properly";
			return response;
		}
		tagToPaper.push({ tag_id: parseInt(tag_id, 10) });
	}

	for(const key in metadata_dict) {
		if(key == "url") continue;
		var tag_id = data.tags[ metadata_dict[key] ];
		if(tag_id == "-1") {
			response.error = "Tags not added properly";
			return response;
		}

		tagToPaper.push({ tag_id: parseInt(tag_id, 10) });
	}

	jsonDict = {paper_id:paper_id, userID:0, tagsArray:tagToPaper};
	data = addTagToPaperBatch(jsonDict);

	response.success = true;
	return response;
}

export const doAddPaper = async e => {
	var title = document.getElementById("titleName").value;
	if (title == "") {
		document.getElementById("uploadStatus").innerHTML = "Paper must include a title";
		return;
	}
	var filename = document.getElementById("filename").innerHTML;
	var url;

	if (filename == "") {
		url = "none";
	} else {
		url = document.getElementById("filename").innerHTML;
	}

	var metadata_dict = {};
	for (const index in field_ids) {
		var value = document.getElementById(field_ids[index]).value;
		if (value !== "") {
			metadata_dict[metadata_ids[index]] = value;
		}
	}
	metadata_dict["url"] = url;

	var data = addPaper(metadata_dict);
	var id = data.id;

	var i;
	for (i = 0; i < tagIDs.length; i++) {
		data = addTagToPaper(id, tagIDs[i], 0);
		document.getElementById("uploadStatus").innerHTML = data.status;
	}

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

	document.getElementById("uploadStatus").innerHTML = "Uploaded Paper";
}

export default class UploadPaper extends React.Component {
		
	state = {
		selectedFile: "",
		isFilePicked: false
	}

	changeHandler = (event) => {
		if (event.target.files[0].type != "application/pdf") {
			document.getElementById("uploadStatus").innerHTML = "Only PDFs can be uploaded.";
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
				doAddPaper();
			  });
		} else if (window.confirm("Are you sure you want to upload the paper without a file?")) {
			doAddPaper();	
		}
	};
	
	renderRedirect = () => {
		if (cookies.get('UserID') == null || cookies.get('PermLvl') < 1) {
			return <Redirect to='/' />
		}
	}

	render() {
		const doAddTag = async e => {
			var tag = document.getElementById("tagsearch").value;

			var data = tagExists(tag, cookies.get('PrefLang'), 0);
			console.log(data);

			if (data.tag_id >= 0) {
				tagsList.push(tag);
				tagIDs.push(data.tag_id);
				document.getElementById("uploadStatus").innerHTML = "";
			}
			else {
				document.getElementById("uploadStatus").innerHTML = "Tag Not Found";
			}
			console.log(tagsList);

			document.getElementById("tagsearch").value = '';
			document.getElementById("tags").value = tagsList.join(", ");

			return;
		}

		const doDeleteTag = async e => {
			var tag = document.getElementById("tagsearch").value;

			var data = tagExists(tag, cookies.get('PrefLang'), 0);
			console.log(data);

			if (data.tag_id >= 0) {
				let index = tagsList.indexOf(tag);
				if (index > -1) {
					tagsList.splice(index, 1);
				}

				index = tagIDs.indexOf(data.tag_id);
				if (index > -1) {
					tagIDs.splice(index, 1);
				}
				document.getElementById("uploadStatus").innerHTML = "";
			}
			else {
				document.getElementById("uploadStatus").innerHTML = "Tag Not Found";
			}
			console.log(tagsList);

			document.getElementById("tagsearch").value = '';
			document.getElementById("tags").value = tagsList.join(", ");

			return;
		}

		return <div className="container" ref={el => (this.div = el)}>
			<div className="header">
				<h1 id="title">Upload Paper</h1>
			</div>
			{this.renderRedirect()}
			<body>
				<div className="PaperBox">
					<div className="PaperFields">
						<div id="MetadataFields">
							<h2 id="leftTitle">Title</h2>
							<input type="text"
								className="PaperBoxes"
								id="titleName"
							/>
							<h2 id="leftAuthor">Author</h2>
							<input type="text"
								className="PaperBoxes"
								id="authorBox"
								placeholder="Optional Author"
							/>
							<h2 id="leftContributor">Contributor</h2>
							<input type="text"
								className="PaperBoxes"
								id="contributor"
								placeholder="Optional Contributor"
							/>
							<h2 id="leftRelations">Relation</h2>
							<input type="text"
								className="PaperBoxes"
								id="relation"
								placeholder="Optional Relations"
							/>
							<h2 id="leftSubject">Subject</h2>
							<input type="text"
								className="PaperBoxes"
								id="subject"
								placeholder="Optional Subject"
							/>
							<h2 id="leftDate">Dates</h2>
							<input type="text"
								className="PaperBoxes"
								id="date"
								placeholder="Optional Date"
							/>
							<h2 id="leftDescription">Description</h2>
							<input type="text"
								className="PaperBoxes"
								id="description"
								placeholder="Optional Description"
							/>
							<h2 id="leftType">Type</h2>
							<input type="text"
								className="PaperBoxes"
								id="type"
								placeholder="Optional Type"
							/>
							<h2 id="leftFormat">Format</h2>
							<input type="text"
								className="PaperBoxes"
								id="format"
								placeholder="Optional Format"
							/>
							<h2 id="leftLanguage">Language</h2>
							<input type="text"
								className="PaperBoxes"
								id="languageBox"
								placeholder="Optional Language"
							/>
							<h2 id="leftSource">Source</h2>
							<input type="text"
								className="PaperBoxes"
								id="sourceBox"
								placeholder="Optional Source"
							/>
							<h2 id="leftPublisher">Publisher</h2>
							<input type="text"
								className="PaperBoxes"
								id="publisher"
								placeholder="Optional Publisher"
							/>
							<h2 id="leftRights">Rights</h2>
							<input type="text"
								className="PaperBoxes"
								id="rights"
								placeholder="Optional Rights"
							/>
							<h2 id="leftCoverage">Coverage</h2>
							<input type="text"
								className="PaperBoxes"
								id="coverage"
								placeholder="Optional Coverage"
							/>
							<h2 id="leftISBN">ISBN</h2>
							<input type="text"
								className="PaperBoxes"
								id="isbn"
								placeholder="Optional ISBN"
							/>
							<h2 id="leftURL">URL</h2>
							<input type="text"
								className="PaperBoxes"
								id="urlBox"
								placeholder="Optional URL"
							/>
							<h2 id="leftLocation">Location</h2>
							<input type="text"
								className="PaperBoxes"
								id="location"
								placeholder="Optional Location"
							/>
							
						</div>
						<hr id="paper_line"></hr>

						<div id="OtherFields">
							<h2 id="leftTags">Tags</h2>
							<input type="text" className="PaperBoxes" id="tags" disabled /><br />
							<button type="button"
								className="PaperBoxes"
								id="addTag"
								onClick={doAddTag}><div id="addTagBtnTxt">+</div></button>
							<button type="button"
								className="PaperBoxes"
								id="addTag"
								onClick={doDeleteTag}><div id="addTagBtnTxt">-</div></button>
							<input type="text" className="PaperBoxes" id="tagsearch" /><br />

							<div id="fileUploadDiv">
								<input type="file" name="file" id="fileUpload" onChange={this.changeHandler} />
								<input type="hidden" id="filename" />
								{this.state.isFilePicked ? (
									// <></>
									<div>
										<p>Size: {this.state.selectedFile.size}</p>
									</div>
								) : (
									<p>Select a file to show details</p>
								)}
								<button type="button" id="clearUploadButton" onClick={this.removeUpload}>Remove Upload</button>
							</div>


							<button type="button" className="PaperBoxes" id="uploadButtonUploadPaper" onClick={this.handleSubmission}><div id="uploadBtnTxt">Upload</div></button>
							<div id="uploadStatus"></div>


						</div>

					</div>
				</div>
			</body>
		</div>
	}
}
