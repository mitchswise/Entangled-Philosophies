import React from "react";
import { Redirect } from 'react-router-dom'; 
import { getTags, addTag, cookies, supported_languages } from '../api.js';
import Table from "./Table";
import './MakeTable.css';

const columns = [
    {
        Header: "Tag",
        accessor: "text"
    },
    {
        Header: "Category",
        accessor: "catText"
    }
];

function makeData() {
    if(!cookies.get('UserID')) return [];
    var result = getTags(cookies.get('UserID'), "eng");
    return result.tags;
}

function doAddTag() {
    var translations = {}
    var tag_category = document.getElementById("tagCategoryBox").value;
    if(!tag_category) {
        document.getElementById("tagsPageStatus").innerHTML = "Please fill out empty fields.";
        return;
    }
    translations["category"] = tag_category;
    var userID = -1;

    if(cookies.get('PermLvl') < 1) { //user adding it
        userID = cookies.get('UserID');
        var tag_name = document.getElementById("defBox").value;
        if(!tag_name) {
            document.getElementById("tagsPageStatus").innerHTML = "Please fill out empty fields.";
            return;
        }
        translations["def"] = tag_name;
    }
    else {
        userID = 0;
        for(const lang in supported_languages) {
            var curLang = supported_languages[lang];
            var id = curLang+'Box';
            var tag_translate = document.getElementById(id).value;

            if(!tag_translate) {
                document.getElementById("tagsPageStatus").innerHTML = "Please fill out empty fields.";
                return; 
            }

            translations[curLang] = tag_translate;
        }
    }

    //SWITCH to calling settings endpoint when it's done
    var language = "eng";

    var data = addTag(userID, language, translations);
    document.getElementById("tagsPageStatus").innerHTML = data.status;
}

function UserEditTag({ rowInfo }) {
    var tagName = rowInfo.text;
    var category = rowInfo.catText;
    return <div>
        <input type="text" className="inputBoxes" id="tagNameBox" value = {tagName} placeholder="tag name" />
        <input type="text" className="inputBoxes" id="tagCategoryBox" value={category} placeholder="tag category" />
        <button >Save</button>
    </div>
}

function UserAddTag() {
    return <div> 
        <input type="text" className="inputBoxes" id="defBox" placeholder="tag name" />
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder="tag category" />
        <button onClick={doAddTag}>Save</button>
    </div>
}

function AdminEditTag() {
    document.getElementById("tagsPageStatus").innerHTML = "In development";
    return <div>
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder="tag category" />
        <input type="text" className="inputBoxes" id="engBox" placeholder="English tag" />
        <input type="text" className="inputBoxes" id="gerBox" placeholder="German tag" />
        <button >Save</button>
    </div>
}

function AdminAddTag() {
    return <div>
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder="tag category" />
        <input type="text" className="inputBoxes" id="engBox" placeholder="English tag" />
        <input type="text" className="inputBoxes" id="gerBox" placeholder="German tag" />
        <button onClick={doAddTag}>Save</button>
    </div>
}

const myData = makeData()

export default class MakeTable extends React.Component {

    //0 = no tag adds/edits have been clicked
    //1 = an admin is adding a tag
    //2 = a user is adding a tag
    //3 = an admin is editing a tag
    //4 = a user is editing a tag
    state = { tagAdditionState : 0,
        rowInfo: null };

    renderRedirect = () => {
        if(!cookies.get('UserID')) {
            return <Redirect to = '/' />
        }
    }
    
    //When a user/admin clicks a tag and wants to edit it.
    loadTag = (rowInfo) => {
        var element = (<div></div>);
        this.setState({ rowInfo: rowInfo });
        if(cookies.get('PermLvl') < 1) {
            this.setState({ tagAdditionState: 4 });
        }
        else {
            this.setState({ tagAdditionState: 3 });
        }
    }

    //When a user/admin clicks on "Add tag"
    makeAddInputBoxes = () => {
        var element = (<div></div>);
        if(cookies.get('PermLvl') < 1) { //regular user
            this.setState({ tagAdditionState: 2 })
        }
        else { //admin 
            this.setState({ tagAdditionState: 1 })
        }
    }

    render() {
        const { tagAdditionState, rowInfo } = this.state;
        return (
            <div className="container">
                <div className="header">
                    <h1 id="title">Tags</h1>
                </div>
                {this.renderRedirect()}
                <body>
                    <div id="wrapper">
                        <div id="leftcolumn">
                            <Table class="tagElement" id="tagTable" columns={columns} data={myData} passedFunction={this.loadTag} />
                            <button onClick={this.makeAddInputBoxes} >Add Tag</button>
                        </div>
                        <div id="rightcolumn">
                            {tagAdditionState == 1 ? <AdminAddTag /> :
                             tagAdditionState == 2 ? <UserAddTag /> :
                             tagAdditionState == 3 ? <AdminEditTag /> :
                             tagAdditionState == 4 ? <UserEditTag rowInfo={rowInfo} /> :
                            <div></div>}
                            
                        </div>
                        <br /><div id = "tagsPageStatus">Status:</div>
                        
                    </div>
                </body>
            </div>
        );
    }
}
