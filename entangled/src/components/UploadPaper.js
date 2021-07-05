import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import './UploadPaper.css';
import { cookies, addPaper, tagExists, addTagToPaper, addMetadataTag } from '../api.js';
import { CSVReader } from 'react-papaparse';
import { tagExistsBatch, addTagBatch, addTagToPaperBatch, paperExists } from '../api.js';

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
		if(dict[key].trim().length == 0) continue;

		if(new_key == "manual tags") {
			tagsList = dict[key].split(";");
			for(let idx = 0; idx < tagsList.length; idx++) {
				tagsList[idx] = tagsList[idx].trim();
			}
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
	
	// //figure out existence of all tags
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
			else if(key == "isbn") category = "ISBN";
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
		isFilePicked: false,
		isIndividualMode: true,
		selectedCSV: "",
		isCSVPicked: false
	}

	handleOnDrop = (data) => {
		console.log(data);
		this.setState({ selectedCSV: data });
		this.setState({ isCSVPicked: true });
	}

	handleOnError = (err, file, inputElem, reason) => {
		console.log(err);
	}

	handleOnRemoveFile = (data) => {
		console.log(data);
		this.setState({ isCSVPicked: false });
	}

	changeHandler = (event) => {
		if (event.target.files[0].type != "application/pdf") {
			document.getElementById("uploadStatus").innerHTML = "Only PDFs can be uploaded.";
		} else {
			this.setState({ selectedFile: event.target.files[0] });
			this.setState({ isFilePicked: true });
		}
	};

	changeMode = () => {
		if (this.state.isIndividualMode)
		{
			this.setState({ isIndividualMode: false });
		}
		else {
			this.setState({ isIndividualMode: true });
		}
		console.log( this.state.isIndividualMode );
	}

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

	handleBatchSubmission = async () => {
		if (this.state.isCSVPicked) {
			var csv = this.state.selectedCSV;
			var paper;
			var title = -1;
			var author = -1;
			var contributor = -1;
			var relation = -1;
			var subject = -1;
			var date = -1;
			var description = -1;
			var type = -1;
			var format = -1;
			var language = -1;
			var source = -1;
			var publisher = -1;
			var rights = -1;
			var coverage = -1;
			var isbn = -1;
			var url = -1;
			var location = -1;
			var editor = -1;
			var translator = -1;
			var manual = -1;

			console.log(csv[0]);
			console.log(csv[0].data.length);
			paper = csv[0].data;
			for (let i = 0; i < csv[0].data.length; i++)
			{
				if (paper[i].toUpperCase() == "TITLE") title = i;
				if (paper[i].toUpperCase() == "AUTHOR") author = i;
				if (paper[i].toUpperCase() == "CONTRIBUTOR") contributor = i;
				if (paper[i].toUpperCase() == "RELATION") relation = i;
				if (paper[i].toUpperCase() == "SUBJECT") subject = i;
				if (paper[i].toUpperCase() == "DATE") date = i;
				if (paper[i].toUpperCase() == "DESCRIPTION") description = i;
				if (paper[i].toUpperCase() == "TYPE") type = i;
				if (paper[i].toUpperCase() == "FORMAT") format = i;
				if (paper[i].toUpperCase() == "LANGUAGE") language = i;
				if (paper[i].toUpperCase() == "SOURCE") source = i;
				if (paper[i].toUpperCase() == "PUBLISHER") publisher = i;
				if (paper[i].toUpperCase() == "RIGHTS") rights = i;
				if (paper[i].toUpperCase() == "COVERAGE") coverage = i;
				if (paper[i].toUpperCase() == "ISBN") isbn = i;
				if (paper[i].toUpperCase() == "URL") url = i;
				if (paper[i].toUpperCase() == "LOCATION") location = i;
				if (paper[i].toUpperCase() == "EDITOR") editor = i;
				if (paper[i].toUpperCase() == "TRANSLATOR") translator = i;
				if (paper[i].toUpperCase() == "MANUAL TAGS") manual = i;
			}

			var papers_uploaded = 0;
			for (let i = 1; i < csv.length-1; i++)
			{
				paper = csv[i].data;
				if (title == -1 || paper[title] == "")
				{
					document.getElementById("uploadStatus").innerHTML = "Not all papers have titles.";
					continue;
				}
				if (author == -1 || paper[author] == "")
				{
					document.getElementById("uploadStatus").innerHTML = "Not all papers have authors.";
					continue;
				}

				var pass = {title: paper[title]};
				pass["Author"] = paper[author];
				let finalContrib = "";
				if (contributor > -1 && paper[contributor] != "") {
				 finalContrib = paper[contributor];
				 if (editor > -1 && paper[editor] != "") finalContrib = finalContrib + ", " + paper[editor] + " - Editor";
				 if (translator > -1 && paper[translator != ""]) finalContrib = finalContrib + ", " + paper[translator] + " - Translator";
				 pass["Contributor"] = finalContrib;
				}
				else if (editor > -1 && paper[editor] != "") {
					finalContrib = csv[i][editor] + " - Editor";
					if (translator > -1 && paper[translator] != "") finalContrib = finalContrib + ", " + paper[translator] + " - Translator";
					pass["Contributor"] = finalContrib
				}
				else if (translator > -1 && paper[translator] != "") pass["Contributor"] = paper[translator] + " - Translator";
				if (relation > -1) pass["Relation"] = paper[relation];
				if (subject > -1) pass["Subject"] = paper[subject];
				if (date > -1) pass["Date"] = paper[date];
				if (description > -1) pass["Description"] = paper[description];
				if (type > -1) pass["Type"] = paper[type];
				if (format > -1) pass["Format"] = paper[format];
				if (language > -1) pass["Language"] = paper[language];
				if (source > -1) pass["Source"] = paper[source];
				if (publisher > -1) pass["Publisher"] = paper[publisher];
				if (rights > -1) pass["Rights"] = paper[rights];
				if (coverage > -1) pass["Coverage"] = paper[coverage];
				if (isbn > -1) pass["ISBN"] = paper[isbn];
				if (url > -1) pass["URL"] = paper[url];
				if (location > -1) pass["Location"] = paper[location];
				if (manual > -1) pass["Manual Tags"] = paper[manual];

				var result = addSpreadsheetPaper(pass);
				console.log(JSON.stringify(result));
				document.getElementById("uploadStatus").innerHTML = result.error;
				if (result.error == undefined) {
					papers_uploaded++;
					document.getElementById("uploadStatus").innerHTML = "All paper successfully uploaded.";
				}
			}

			console.log("We uploaded " + papers_uploaded);
		}
	}

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

						{this.state.isIndividualMode? (
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

								<div>
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
									<button type="button" className="PaperBoxes" id="uploadButtonUploadPaper" onClick={this.changeMode}><div id="uploadBtnTxt">Upload CSV</div></button>
								</div>
							</div>
							) : (
								<div id="OtherFields">
									<div id="fileUploadDiv">
										<CSVReader
										 onDrop={this.handleOnDrop}
										 onError={this.handleOnError}
										 addRemoveButton
										 removeButtonColor='#659cef'
										 onRemoveFile={this.handleOnRemoveFile}
										>
											<span>Drop CSV file here or click to upload.</span>
										</CSVReader>
									</div>
									<button type="button" className="PaperBoxes" id="uploadButtonUploadPaper" onClick={this.handleBatchSubmission}><div id="uploadBtnTxt">Upload</div></button>
									<div id="uploadStatus"></div>
									<button type="button" className="PaperBoxes" id="uploadButtonUploadPaper" onClick={this.changeMode}><div id="uploadBtnTxt">Upload Individual File</div></button>
								</div>
							)}
					</div>
				</div>
			</body>
		</div>
	}
}
