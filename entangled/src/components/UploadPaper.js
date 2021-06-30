import React, {useState} from 'react';
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
