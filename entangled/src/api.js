var urlBase = 'http://chdr.cs.ucf.edu/~entangledPhilosophy/Entangled-Philosophies/api';

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
