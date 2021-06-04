import Cookies from 'universal-cookie';
export const cookies = new Cookies();
export const supported_languages = ["eng", "ger"];

// var urlBase = 'http://chdr.cs.ucf.edu/~entangledPhilosophy/Entangled-Philosophies/api';
var urlBase = 'http://chdr.cs.ucf.edu/~ah458967/Entangled-Philosophies/api';

var xhr;

function connect(type, url) {
	xhr = new XMLHttpRequest();
	xhr.open(type, url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
}

export function testConnect() {
    var url = urlBase + '/testconnect.php';

    connect("POST", url);

    var jsonPayload = "";

    try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
    } catch (err) {
        return null;
    }
}

export function addUser(username, email, password, language) {
	var jsonPayload = '{"username":"' + username + '", "email":"' + email + '", "password":"' + password + '", "language": "' + language + '"}';
	var url = urlBase + '/addUser.php';

	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function login(username, password) {
	var jsonPayload = '{"username":"' + username + '", "password":"' + password + '"}';
	var url = urlBase + '/login.php';

	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		cookies.set('login', jsonObject.UserID, { path: '/' });
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function sendActivation(username) {
	var jsonPayload = '{"username":"' + username + '"}';
	var url = urlBase + '/sendActivation.php';

	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function resetPassword(username, email) {
	var jsonPayload = '{"username":"' + username + '", "email":"' + email + '"}';
	var url = urlBase + '/resetPassword.php';
	
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function setPerms(username, permission_level) {
	var jsonPayload = '{"username":"' + username + '", "permission_level":' + permission_level + '}';
	var url = urlBase + '/setPerms.php';

	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getPerms(username) {
	var jsonPayload = '{"username":"' + username + '"}';
	var url = urlBase + '/getPerms.php';
	
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getAdmins() {
	var url = urlBase + '/getAdmins.php';

	connect("GET", url);

	try {
		xhr.send();
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function addTag(user, language, translations, edit_tag) {
	var jsonPayload = '{"userID":' + user + ', "language":"' + language + '", "edit_tag":' + edit_tag + ', ';
	for(const lang in translations) {
		jsonPayload += '"' + lang + '":"' + translations[lang] + '", ';
	}
	jsonPayload = jsonPayload.substring(0, jsonPayload.length-2) + "}";

	var url = urlBase + '/addTag.php';
	connect("POST", url);
	
	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}

}

export function removeTag(name, language, user) {
	var jsonPayload = '{"name":"' + name + '", "language":"' + language + '", "userID":' + user + '}';

	var url = urlBase + '/removeTag.php';
	connect("POST", url);
	
	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getTags(userID, language) {
	var jsonPayload = '{"userID":"' + userID + '", "language":"' + language + '"}';

	var url = urlBase + '/getTags.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getTagTranslation(tag_id) {
	var jsonPayload = '{"tag_id":' + tag_id + '}';

	var url = urlBase + '/getTagTranslations.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function addCategory(user, cat_id, translations) {
	var jsonPayload = '{"userID":' + user + ', "edit_category":' + cat_id + ', ';
	for(const lang in translations) {
		jsonPayload += '"' + lang + '":"' + translations[lang] + '", ';
	}
	jsonPayload = jsonPayload.substring(0, jsonPayload.length-2) + "}";

	var url = urlBase + '/addCategory.php';
	connect("POST", url);
	
	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}

}

export function removeCategory(name, language, user) {
	var jsonPayload = '{"name":"' + name + '", "language":"' + language + '", "userID":' + user + '}';

	var url = urlBase + '/removeCategory.php';
	connect("POST", url);
	
	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getCats(userID, language) {
	var jsonPayload = '{"userID":"' + userID + '", "language":"' + language + '"}';

	var url = urlBase + '/getCategories.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getCategoryTranslation(cat_id) {
	var jsonPayload = '{"cat_id":' + cat_id + '}';

	var url = urlBase + '/getCategoriesTranslations.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function addPaper(metadata_dict) {
	var jsonPayload = JSON.stringify(metadata_dict);

	var url = urlBase + '/addPaper.php';	
	connect("POST", url);
  
  try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function addMetadataTag(category, language, text, tag_id) {
	var jsonDict = {category:category, language:language, text:text, tag_id:tag_id };
	var jsonPayload = JSON.stringify(jsonDict);

	var url = urlBase + '/addMetadataTag.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function removePaper(id) {
	var jsonPayload = '{"id":' + id + '}';
	
	var url = urlBase + '/removePaper.php';
 	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function tagExists(text, language, userID) {
	var jsonDict = {text:text, language:language, userID:userID };
	var jsonPayload = JSON.stringify(jsonDict);

	var url = urlBase + '/tagExists.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function addTagToPaper(paper_id, tag_id, userID) {
	var jsonDict = {paper_id:paper_id, tag_id:tag_id, userID:userID };
	var jsonPayload = JSON.stringify(jsonDict);

	
	var url = urlBase + '/addTagToPaper.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getUserInfo(userID) {
	var jsonDict = { id:userID };
	var jsonPayload = JSON.stringify(jsonDict);
	
	var url = urlBase + '/getUserInfo.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function sqlSearch(userID, query) {
	var jsonDict = { userID:userID, query:query };
	var jsonPayload = JSON.stringify(jsonDict);

	var url = urlBase + '/sqlSearch.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function saveQuery(jsonDict) {
	var jsonPayload = JSON.stringify(jsonDict);

	var url = urlBase + '/saveQuery.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function handleHistory(userID) {
	var jsonDict = {owner:userID};
	var jsonPayload = JSON.stringify(jsonDict);

	var url = urlBase + '/handleHistory.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function getQueries(userID) {
	var jsonDict = {owner:userID};
	var jsonPayload = JSON.stringify(jsonDict);

	var url = urlBase + '/getQueries.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}

export function removeQueries(jsonDict) {
	var jsonPayload = JSON.stringify(jsonDict);
	console.log("Sending " + jsonPayload);
	
	var url = urlBase + '/removeQueries.php';
	connect("POST", url);

	try {
		xhr.send(jsonPayload);
		console.log(">> " + xhr.responseText);
		var jsonObject = JSON.parse(xhr.responseText);
		return jsonObject;
	} catch (err) {
		return null;
	}
}
