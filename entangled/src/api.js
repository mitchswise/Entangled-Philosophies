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
		console.log(cookies.get('login'));
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

export function addTag(user, language, translations) {
	var jsonPayload = '{"userID":' + user + ', "language":"' + language + '", ';
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
