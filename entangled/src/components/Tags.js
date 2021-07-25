import React from "react";
import { Redirect } from 'react-router-dom';
import {
    getTags, addTag, removeTag, getTagTranslation,
    getCats, addCategory, removeCategory, getCategoryTranslation,
    cookies, supported_languages
} from '../api.js';
import Table from "./TagsTable";
import './Tags.css';
import { getPermLvl, getGlobalLanguage } from "../api.js";
import { dSettings, wordLookup } from '../dictionary.js';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

var userLanguage = getGlobalLanguage();
var userPermLvl = getPermLvl();

//table set-up functions:

const columnsTags = [
    {
        Header: dSettings(16, userLanguage),
        accessor: "text"
    },
    {
        Header: dSettings(29, userLanguage),
        accessor: "catText"
    },
    {
        Header: dSettings(21, userLanguage),
        accessor: "frequency"
    }
];

const columnsCategories = [
    {
        Header: dSettings(29, userLanguage),
        accessor: "text"
    }
];

//loads all available tags for a user
function getTagData() {
    if (!cookies.get('UserID')) return [];
    var prefLang = userLanguage;
    var result = getTags(cookies.get('UserID'), prefLang);

    var tagsList = []
    for (const index in result.tags) {
        const entry = result.tags[index];
        if (entry["is_metadata"] === "0") {
            tagsList.push(entry);
        }
    }

    return tagsList;
}

//loads all available categories for a user
function getCategoryData() {
    if (!cookies.get('UserID')) return [];
    var prefLang = userLanguage;
    var result = getCats(cookies.get('UserID'), prefLang);
    return result.categories;
}

//endpoint calling functions:

//add/edit a tag to the database
function doAddTag(edit_tag) {
    var translations = {}
    var tag_category = document.getElementById("tagCategoryBox").value;
    if (!tag_category) {
        document.getElementById("tagsPageStatus").innerHTML = dSettings(147, userLanguage);
        return;
    }
    translations["category"] = tag_category;
    var userID = -1;

    if (userPermLvl < 1) { //user adding it
        userID = cookies.get('UserID');
        var tag_name = document.getElementById("defBox").value;
        if (!tag_name) {
            document.getElementById("tagsPageStatus").innerHTML = dSettings(147, userLanguage);
            return;
        }
        translations["def"] = tag_name;
    }
    else {
        userID = 0;
        for (const lang in supported_languages) {
            var curLang = supported_languages[lang];
            var id = curLang + 'Box';
            var tag_translate = document.getElementById(id).value;

            if (!tag_translate) {
                document.getElementById("tagsPageStatus").innerHTML = dSettings(147, userLanguage);
                return;
            }

            translations[curLang] = tag_translate;
        }
    }

    //SWITCH to calling settings endpoint when it's done
    var language = userLanguage;

    var data = addTag(userID, language, translations, edit_tag);
    document.getElementById("tagsPageStatus").innerHTML = wordLookup(data.status, userLanguage);
}

//remove a tag from the database
function doRemoveTag(rowInfo) {
    var tagName = rowInfo.text;
    var userID = rowInfo.owner;
    var language = rowInfo.owner == 0 ? userLanguage : "def";

    var data = removeTag(tagName, language, userID);
    document.getElementById("tagsPageStatus").innerHTML = wordLookup(data.status, userLanguage);
}

//add/edit a category to the database
function doAddCat(edit_cat) {
    var translations = {}
    var userID = -1;

    if (userPermLvl < 1) { //user adding it
        userID = cookies.get('UserID');
        var cat_name = document.getElementById("defBox").value;
        if (!cat_name) {
            document.getElementById("tagsPageStatus").innerHTML = dSettings(147, userLanguage);
            return;
        }
        translations["def"] = cat_name;
    }
    else {
        userID = 0;
        for (const lang in supported_languages) {
            var curLang = supported_languages[lang];
            var id = curLang + 'Box2';
            var tag_translate = document.getElementById(id).value;

            if (!tag_translate) {
                document.getElementById("tagsPageStatus").innerHTML = dSettings(147, userLanguage);
                return;
            }

            translations[curLang] = tag_translate;
        }
    }

    var data = addCategory(userID, edit_cat, translations);
    document.getElementById("tagsPageStatus").innerHTML = wordLookup(data.status, userLanguage);
}

//remove a category from the database
function doRemoveCat(rowInfo) {
    var catName = rowInfo.text;
    var userID = rowInfo.owner;
    var language = rowInfo.owner == 0 ? userLanguage : "def";

    var data = removeCategory(catName, language, userID);
    document.getElementById("tagsPageStatus").innerHTML = wordLookup(data.status, userLanguage);
}

//conditional render functions for TAG AND CATEGORY button clicks:

function UserEdit({ rowInfo, toggleState }) {
    if (toggleState) {
        var translations = getCategoryTranslation(rowInfo.cat_id);
        var cat = translations.def;
        return <div>
            <h1 id="editTagHeader">Edit Category</h1>
            <input type="text" className="taginputBoxes" id="defBox" placeholder={cat} />
            <button class="editCatButtonsAdmin" onClick={() => doAddCat(rowInfo.cat_id)}>{dSettings(27, userLanguage)}</button>
            <button class="editCatButtonsAdmin" id="tagtDeleteButton" onClick={() => doRemoveCat(rowInfo)} >{dSettings(28, userLanguage)}</button>
        </div>
    }
    var tagName = rowInfo.text;
    var category = rowInfo.catText;
    return <div>
        <h1 id="editTagHeader">Edit Tag</h1>
        <input type="text" className="taginputBoxes" id="defBox" placeholder={tagName} />
        <input type="text" className="taginputBoxes" id="tagCategoryBox" placeholder={category} />
        <button class="editTagButtonsAdmin" onClick={() => doAddTag(rowInfo.tag_id)}>{dSettings(27, userLanguage)}</button>
        <button class="editTagButtonsAdmin" id="tagtDeleteButton" onClick={() => doRemoveTag(rowInfo)} >{dSettings(28, userLanguage)}</button>
    </div>
}

function UserAdd({ toggleState }) {
    if (toggleState) {
        return <div>
            <h1 id="editTagHeader2">Add Category</h1>
            <input type="text" className="taginputBoxes" id="defBox" placeholder="Category name" />
            <button id="addCatButtonsAdmin" onClick={() => doAddCat(-1)}>{dSettings(27, userLanguage)}</button>
        </div>
    }
    return <div>
        <h1 id="editTagHeader">Add Tag</h1>
        <input type="text" className="taginputBoxes" id="defBox" placeholder="tag name" />
        <input type="text" className="taginputBoxes" id="tagCategoryBox" placeholder="tag category" />
        <button id="addTagButtonsAdmin" onClick={() => doAddTag(-1)}>{dSettings(27, userLanguage)}</button>
    </div>
}

function AdminEdit({ rowInfo, toggleState }) {
    if (toggleState) {
        var translations = getCategoryTranslation(rowInfo.cat_id);
        var cat_eng = translations.eng;
        var cat_ger = translations.ger;
        return <div>
            <h1 id="editTagHeader">Edit Category</h1>
            <h4 class="rightBoxText" id="rightBoxTextCategory">{dSettings(130, userLanguage)}</h4>
            <input type="text" className="taginputBoxes" id="engBox2" placeholder={cat_eng} />
            <h4 class="rightBoxText" id="rightBoxTextCategory">{dSettings(131, userLanguage)}</h4>
            <input type="text" className="taginputBoxes" id="gerBox2" placeholder={cat_ger} />
            <button class="editCatButtonsAdmin" onClick={() => doAddCat(rowInfo.cat_id)}>{dSettings(27, userLanguage)}</button>
            <button class="editCatButtonsAdmin" id="tagtDeleteButton" onClick={() => doRemoveCat(rowInfo)} >{dSettings(28, userLanguage)}</button>
        </div>
    }

    var translations = getTagTranslation(rowInfo.tag_id);

    var category = rowInfo.catText;
    var tag_eng = translations.eng;
    var tag_ger = translations.ger;

    return <div>
        <h1 id="editTagHeader">{dSettings(26, userLanguage)}</h1>
        <h4 class="rightBoxText" id="rightBoxTextCategory">{dSettings(29, userLanguage)}</h4>
        <input type="text" className="taginputBoxes" id="tagCategoryBox" placeholder={category} />
        <h4 class="rightBoxText" id="rightBoxTextCategory">{dSettings(30, userLanguage)}</h4>
        <input type="text" className="taginputBoxes" id="engBox" placeholder={tag_eng} />
        <h4 class="rightBoxText" id="rightBoxTextCategory">{dSettings(31, userLanguage)}</h4>
        <input type="text" className="taginputBoxes" id="gerBox" placeholder={tag_ger} />
        <button class="editTagButtonsAdmin" onClick={() => doAddTag(rowInfo.tag_id)}>{dSettings(27, userLanguage)}</button>
        <button class="editTagButtonsAdmin" id="tagtDeleteButton" onClick={() => doRemoveTag(rowInfo)} >{dSettings(28, userLanguage)}</button>
    </div>
}

function AdminAdd({ toggleState }) {
    if (toggleState) {
        return <div>
            <h1 id="editTagHeader2">{dSettings(18, userLanguage)}</h1>
            <h4 class="rightBoxText2" id="rightBoxTextEnglish">{dSettings(130, userLanguage)}</h4>
            <input type="text" className="taginputBoxesToggled" id="engBox2" placeholder="English Category" />
            <h4 class="rightBoxText2" id="rightBoxTextGerman">{dSettings(131, userLanguage)}</h4>
            <input type="text" className="taginputBoxesToggled" id="gerBox2" placeholder="German Category" />
            <button id="addTagButtonsAdmin" onClick={() => doAddCat(-1)}>{dSettings(27, userLanguage)}</button>
        </div>
    }
    return <div>
        <h1 id="editTagHeader">{dSettings(18, userLanguage)}</h1>
        <h4 class="rightBoxText" id="rightBoxTextCategory">{dSettings(29, userLanguage)}</h4>
        <input type="text" className="taginputBoxes" id="tagCategoryBox" placeholder="Tag Category" />
        <h4 class="rightBoxText" id="rightBoxTextEnglishTag">{dSettings(30, userLanguage)}</h4>
        <input type="text" className="taginputBoxes" id="engBox" placeholder="English Tag" />
        <h4 class="rightBoxText" id="rightBoxTextGermanTag">{dSettings(31, userLanguage)}</h4>
        <input type="text" className="taginputBoxes" id="gerBox" placeholder="German Tag" />
        <button id="addTagButtonsAdmin" onClick={() => doAddTag(-1)}>{dSettings(27, userLanguage)}</button>
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
    state = {
        tagAdditionState: 0,
        toggleState: false,
        rowInfo: null,
        helpVideo: false
    };

    //not logged in?
    renderRedirect = () => {
        if (!cookies.get('UserID')) {
            return <Redirect to='/' />
        }
    }

    //clear input boxes when switching between row entries
    elementClear = () => {
        const taginputBoxes = ["tagCategoryBox", "engBox", "gerBox", "defBox"];
        for (const tag in taginputBoxes) {
            var element = taginputBoxes[tag];
            if (document.getElementById(element) != null) {
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
        if (document.getElementById("tagsPageStatus")) {
            document.getElementById("tagsPageStatus").innerHTML = "";
        }
        if (userPermLvl < 1) {
            if (rowInformation.owner !== cookies.get('UserID')) {
                document.getElementById("tagsPageStatus").innerHTML = dSettings(168, this.props.userLang);
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
        if (userPermLvl < 1) { //regular user
            this.setState({ tagAdditionState: 2 })
        }
        else { //admin 
            this.setState({ tagAdditionState: 1 })
        }
    }

    openHelpVideo = () => {
        this.setState((prevState) => ({ helpVideo: !prevState.helpVideo }));
    }

    render() {
        const { tagAdditionState, toggleState } = this.state;
        return (
            <div className="container">
                <div className="header">
                    {
                        toggleState === false ? <h1 id="title">{dSettings(123, userLanguage)}</h1>
                            : <h1 id="title">{dSettings(17, userLanguage)}</h1>
                    }
                    <div id="iconWrapper" onClick={this.openHelpVideo}>
                        <FontAwesomeIcon icon={faQuestionCircle} id="HomeQuestionCircle" size='2x' />
                    </div>
                </div>
                {this.renderRedirect()}
                <body>
                    <div id="wrapper">
                        <div id="leftcolumn">
                            {
                                toggleState === false ?
                                    <Table class="tagElement" id="tagTable" columns={columnsTags}
                                        data={tagData} loadTag={this.loadTag} addTags={this.makeTagAddInputBoxes}
                                        toggleView={this.toggleView} userLang={this.props.userLang} /> :
                                    <Table class="tagElement" id="tagTable" columns={columnsCategories}
                                        data={categoryData} loadTag={this.loadTag} addTags={this.makeTagAddInputBoxes}
                                        toggleView={this.toggleView} userLang={this.props.userLang} />
                            }
                        </div>
                        <div id="rightcolumn">
                            {this.elementClear()}
                            {tagAdditionState === 1 ? <AdminAdd toggleState={toggleState} /> :
                                tagAdditionState === 2 ? <UserAdd toggleState={toggleState} /> :
                                    tagAdditionState === 3 ? <AdminEdit toggleState={toggleState} rowInfo={this.state.rowInfo} /> :
                                        tagAdditionState === 4 ? <UserEdit toggleState={toggleState} rowInfo={this.state.rowInfo} /> :
                                            <div></div>}
                            <div id="tagsPageStatus"></div>
                        </div>
                    </div>
                    <div id="extrDiv">
                        <Dialog open={this.state.helpVideo} onClose={this.openHelpVideo}>
                            <DialogContent>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/ZGqpHkFNVQc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.openHelpVideo}
                                    color="primary" autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </body>
            </div>
        );
    }
}
