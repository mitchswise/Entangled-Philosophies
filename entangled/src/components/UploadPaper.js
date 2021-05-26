import React from 'react';
import { Redirect} from 'react-router-dom';
import './UploadPaper.css';
import { cookies, addPaper } from '../api.js';

function doAddPaper() {
	var title = document.getElementById("titleName").value;
	var author = document.getElementById("author").value;
	var url = "hard/coded/url";

	addPaper(title, author, url);
}

export default class UploadPaper extends React.Component {
	//state = { tagSelection: null };
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
        return <div className="container" ref={el => (this.div = el)}>
            <div className="header">
                <h1 id="title">Upload Paper</h1>
            </div>
            {this.renderRedirect()}
            <div className="PaperBox">
                <div className="PaperFields">
                    <h2 id="leftTitle">Title</h2>
                    <input type="text" className="inputBoxes" id="titleName" /><br />
                    <h2 id="leftAuthor">Author</h2>
                    <input type="text" className="inputBoxes" id="author" /><br />
					<h2 id="leftTags">Tags</h2>
					<input type="text" className="inputBoxes" id="tags" disabled/><br />
					<button type="button" className="inputBoxes" id="addTag"><div id="addTagBtnTxt">+</div></button>
					<input type="text" className="inputBoxes" id="tagsearch" /><br />

					<br /><br /><br />

					<form id="uploadForm" method="post" enctype="multipart/form-data">
						Upload a file:
						<input type="file" name="file" id="paperFile"/>
						<input type="submit" name="submit" id="paperSubmit"/>
					</form>

                    <button type="button" className="inputBoxes" id="upload" onClick={doAddPaper}><div id="uploadBtnTxt">Upload</div></button>


                    <hr id="hr"></hr>
                    

                </div>
            </div>
		</div>
    }
}
