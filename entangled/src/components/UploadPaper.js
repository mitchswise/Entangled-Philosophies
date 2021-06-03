import React from 'react';
import { Redirect } from 'react-router-dom';
import './UploadPaper.css';
import { cookies, addPaper, tagExists, addTagToPaper } from '../api.js';

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
			
			var data = tagExists(tag, "eng", cookies.get('UserID'));
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
			var title = document.getElementById("titleName").value;
			var author = document.getElementById("authorBox").value;
			var contributor = document.getElementById("contributor").value;
			var subject = document.getElementById("subject").value;
			var date = document.getElementById("date").value;
			var description = document.getElementById("description").value;
			var publisher = document.getElementById("publisher").value;
			var isbn = document.getElementById("isbn").value;
			var filename = document.getElementById("filename").value;
			var url;
			
			if (title == "") {
				document.getElementById("paperStatus").innerHTML = "Paper must include a title";
				return;
			}
			if (filename == "") {
				url = "none";
			} else {
				url =  document.getElementById("filename").value;
			}

			var data = addPaper(title, author, url);
			var id = data.id;
			
			var i;
			for (i = 0; i < tagIDs.length; i++){
				data = addTagToPaper(id, tagIDs[i], 0);
				document.getElementById("paperStatus").innerHTML = data.status;
			}
			
			document.getElementById("titleName").innerHTML = "";
			document.getElementById("authorBox").innerHTML = "";
			document.getElementById("contributor").innerHTML = "";
			document.getElementById("subject").innerHTML = "";
			document.getElementById("date").innerHTML = "";
			document.getElementById("description").innerHTML = "";
			document.getElementById("publisher").innerHTML = "";
			document.getElementById("isbn").innerHTML = "";
			document.getElementById("filename").innerHTML = "";
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
