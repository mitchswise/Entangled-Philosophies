import React from 'react';
import { Redirect} from 'react-router-dom';
import './UploadPaper.css';
import { cookies } from '../api.js';

export default class UploadPaper extends React.Component {
	//state = { tagSelection: null };

    renderRedirect = () => {
        if(cookies.get('UserID') == null) {
            return <Redirect to = '/' />
        }
    }

    render() {
		const tagChoices = []
		var tagChoice = "Tag";
		
		tagChoices.push(
			<div class="dropdown" id="dropdowncontainer2">
				<button class="dropbtn" id="dropdown2">{tagChoice}</button>
				<div class="dropdown-content">
					<button type="submit" onClick=tag1(){ tagChoice="Temp Tag 1"; }>Temp Tag 1</button>
					<button type="submit" onClick=tag2(){ console.log(tagChoice); }>Temp Tag 2</button>
					<button type="submit">Temp Tag 3</button>
					<button type="submit">Temp Tag 4</button>
					<button type="submit">Temp Tag 5</button>
					<button type="submit">Temp Tag 6</button>
					<button type="submit">Temp Tag 7</button>
					<button type="submit">Temp Tag 8</button>
					<button type="submit">Temp Tag 9</button>
				</div>
			</div>
		)
		
        return <div className="container">
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
					{tagChoices}
                    <button type="button" className="inputBoxes" id="upload"><div id="uploadBtnTxt">Upload</div></button>


                    <hr id="hr"></hr>
                    

                </div>
            </div>
        </div>
    }
}