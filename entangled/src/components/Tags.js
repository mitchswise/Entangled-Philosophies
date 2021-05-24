import React from "react";
import { Redirect } from 'react-router-dom'; 
import { getTags, addTag, removeTag, getTagTranslation, 
    getCats, addCategory, removeCategory, getCategoryTranslation, 
    cookies, supported_languages } from '../api.js';
import Table from "./TagsTable";
import './Tags.css';

//table set-up functions:

const columnsTags = [
    {
        Header: "Tag",
        accessor: "text"
    },
    {
        Header: "Category",
        accessor: "catText"
    }
];

const columnsCategories = [
    {
        Header: "Category",
        accessor: "text"
    }
];

//loads all available tags for a user
function getTagData() {
    if(!cookies.get('UserID')) return [];
    var result = getTags(cookies.get('UserID'), "eng");
    return result.tags;
}

//loads all available categories for a user
function getCategoryData() {
    if(!cookies.get('UserID')) return [];
    var result = getCats(cookies.get('UserID'), "eng");
    return result.categories;
}

//endpoint calling functions:

//add/edit a tag to the database
function doAddTag(edit_tag) {
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

    var data = addTag(userID, language, translations, edit_tag);
    document.getElementById("tagsPageStatus").innerHTML = data.status;
}

//remove a tag from the database
function doRemoveTag(rowInfo) {
    var tagName = rowInfo.text;
    var userID = rowInfo.owner;
    var language = rowInfo.owner == 0 ? "eng" : "def"; //Switch!

    var data = removeTag(tagName, language, userID);
    document.getElementById("tagsPageStatus").innerHTML = "Status: " + data.status;
}

//add/edit a category to the database
function doAddCat(edit_cat) {
    console.log("Test " + edit_cat);
    var translations = {}
    var userID = -1;

    if(cookies.get('PermLvl') < 1) { //user adding it
        userID = cookies.get('UserID');
        var cat_name = document.getElementById("defBox").value;
        console.log("Hi " + cat_name);
        if(!cat_name) {
            document.getElementById("tagsPageStatus").innerHTML = "Please fill out empty fields.";
            return;
        }
        translations["def"] = cat_name;
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

    var data = addCategory(userID, edit_cat, translations);
    document.getElementById("tagsPageStatus").innerHTML = data.status;
}

//remove a category from the database
function doRemoveCat(rowInfo) {
    var catName = rowInfo.text;
    var userID = rowInfo.owner;
    var language = rowInfo.owner == 0 ? "eng" : "def"; //Switch!

    var data = removeCategory(catName, language, userID);
    document.getElementById("tagsPageStatus").innerHTML = "Status: " + data.status;
}

//conditional render functions for TAG AND CATEGORY button clicks:

function UserEdit({ rowInfo, toggleState }) {
    if(toggleState) {
        var translations = getCategoryTranslation(rowInfo.cat_id);
        var cat = translations.def;
        return <div>
            <h1 id="editTagHeader">Edit Category</h1>
            <input type="text" className="inputBoxes" id="defBox" placeholder={cat} />
            <button id="editCatButtons" onClick={() => doAddCat(rowInfo.cat_id)}>Save</button>
            <button id="editCatButtons" onClick={() => doRemoveCat(rowInfo)} >Delete</button>
        </div>
    }
    var tagName = rowInfo.text;
    var category = rowInfo.catText;
    return <div>
        <h1 id="editTagHeader">Edit Tag</h1>
        <input type="text" className="inputBoxes" id="defBox" placeholder={tagName} />
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder={category} />
        <button id="editTagButtons" onClick={() => doAddTag(rowInfo.tag_id)}>Save</button>
        <button id="editTagButtons" onClick={() => doRemoveTag(rowInfo)} >Delete</button>
    </div>
}

function UserAdd({ toggleState }) {
    if(toggleState) {
        return <div>
            <h1 id="editTagHeader">Add Category</h1>
            <input type="text" className="inputBoxes" id="defBox" placeholder="Category name" />
            <button id="addCatButtons" onClick={() => doAddCat(-1)}>Save</button>
        </div>
    }
    return <div> 
        <h1 id="editTagHeader">Add Tag</h1>
        <input type="text" className="inputBoxes" id="defBox" placeholder="tag name" />
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder="tag category" />
        <button id="addTagButtons" onClick={() => doAddTag(-1)}>Save</button>
    </div>
}

function AdminEdit({ rowInfo, toggleState }) {
    if(toggleState) {
        var translations = getCategoryTranslation(rowInfo.cat_id);
        var cat_eng = translations.eng;
        var cat_ger = translations.ger;
        return <div>
            <h1 id="editTagHeader">Edit Category</h1>
            <input type="text" className="inputBoxes" id="engBox" placeholder={cat_eng} />
            <input type="text" className="inputBoxes" id="gerBox" placeholder={cat_ger} />
            <button id="editCatButtonsAdmin" onClick={() => doAddCat(rowInfo.cat_id)}>Save</button>
            <button id="editCatButtonsAdmin" onClick={() => doRemoveCat(rowInfo)} >Delete</button>
        </div>
    }

    var translations = getTagTranslation(rowInfo.tag_id);

    var category = rowInfo.catText;
    var tag_eng = translations.eng;
    var tag_ger = translations.ger;

    return <div>
        <h1 id="editTagHeader">Edit Tag</h1>
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder={category} />
        <input type="text" className="inputBoxes" id="engBox" placeholder={tag_eng} />
        <input type="text" className="inputBoxes" id="gerBox" placeholder={tag_ger} />
        <button id="editTagButtonsAdmin" onClick={() => doAddTag(rowInfo.tag_id)}>Save</button>
        <button id="editTagButtonsAdmin" onClick={() => doRemoveTag(rowInfo)} >Delete</button>
    </div>
}

function AdminAdd({ toggleState }) {
    if(toggleState) {
        return <div>
            <h1 id="editTagHeader">Add Category</h1>
            <input type="text" className="inputBoxes" id="engBox" placeholder="English category" />
            <input type="text" className="inputBoxes" id="gerBox" placeholder="German category" />
            <button id="addCatButtonsAdmin" onClick={() => doAddCat(-1)}>Save</button>
        </div>
    }
    return <div>
        <h1 id="editTagHeader">Add Tag</h1>
        <input type="text" className="inputBoxes" id="tagCategoryBox" placeholder="tag category" />
        <input type="text" className="inputBoxes" id="engBox" placeholder="English tag" />
        <input type="text" className="inputBoxes" id="gerBox" placeholder="German tag" />
        <button id="addTagButtonsAdmin" onClick={() => doAddTag(-1)}>Save</button>
    </div>
}

const tagData = getTagData()
const categoryData = getCategoryData()

export default class Tags extends React.Component {

    //0 = no tag adds/edits have been clicked
    //1 = an admin is adding a tag
    //2 = a user is adding a tag
    //3 = an admin is editing a tag
    //4 = a user is editing a tag
    state = { tagAdditionState : 0,
        toggleState : false,
        rowInfo: null };

    //not logged in?
    renderRedirect = () => {
        if(!cookies.get('UserID')) {
            return <Redirect to = '/' />
        }
    }

    //clear input boxes when switching between row entries
    elementClear = () => {
        const inputBoxes = ["tagCategoryBox", "engBox", "gerBox", "defBox"];
        for(const tag in inputBoxes) {
            var element = inputBoxes[tag];
            if(document.getElementById(element) != null) {
                document.getElementById(element).value = "";
            }
        }
    }

    //switch from tag to category view (or vice versa)
    toggleView = () => {
        this.setState((prevState) => ({ toggleState: !prevState.toggleState }));
    }
    
    //When a user/admin clicks an entry and wants to edit it.
    loadTag = (rowInformation) => {
        this.setState({ rowInfo: rowInformation });
        if(cookies.get('PermLvl') < 1) {
            if(rowInformation.owner !== cookies.get('UserID')) {
                document.getElementById("tagsPageStatus").innerHTML = "Status: You can't edit public items.";
                this.setState({ tagAdditionState: 0 });
            }
            else {
                this.setState({ tagAdditionState: 4 });
            }
        }
        else {
            this.setState({ tagAdditionState: 3 });
        }
    }

    //When a user/admin clicks on "Add"
    makeTagAddInputBoxes = () => {
        if(cookies.get('PermLvl') < 1) { //regular user
            this.setState({ tagAdditionState: 2 })
        }
        else { //admin 
            this.setState({ tagAdditionState: 1 })
        }
    }

    render() {
        const { tagAdditionState, toggleState } = this.state;
        return (
            <div className="container">
                <div className="header">
                    {
                        toggleState === false ? <h1 id="title">Tags</h1>
                        : <h1 id="title">Categories</h1>
                    }
                </div>
                {this.renderRedirect()}
                <body>
                    <div id="wrapper">
                        <div id="leftcolumn">
                            {
                                toggleState === false ?
                                <Table class="tagElement" id="tagTable" columns={columnsTags} 
                                data={tagData} loadTag={this.loadTag} addTags={this.makeTagAddInputBoxes}
                                toggleView={this.toggleView} /> :
                                <Table class="tagElement" id="tagTable" columns={columnsCategories} 
                                data={categoryData} loadTag={this.loadTag} addTags={this.makeTagAddInputBoxes}
                                toggleView={this.toggleView} />
                            }
                            <div id = "tagsPageStatus">Status:</div>
                        </div>
                        <div id="rightcolumn">
                            {this.elementClear()}
                            {tagAdditionState === 1 ? <AdminAdd toggleState={toggleState} /> :
                             tagAdditionState === 2 ? <UserAdd toggleState={toggleState} /> :
                             tagAdditionState === 3 ? <AdminEdit toggleState={toggleState} rowInfo={this.state.rowInfo} /> :
                             tagAdditionState === 4 ? <UserEdit toggleState={toggleState} rowInfo={this.state.rowInfo} /> :
                            <div></div>}
                        </div>
                    </div>
                </body>
            </div>
        );
    }
}
