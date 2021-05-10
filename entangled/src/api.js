var urlBase = 'http://chdr.cs.ucf.edu/~entangledPhilosophy/Entangled-Philosophies/entangled/src/api';

export function testConnect() {
    var url = urlBase + '/testconnect.php';

    console.log("Starting " + url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    var jsonPayload = "";

    try {
        xhr.send(jsonPayload);
        var jsonObject = JSON.parse(xhr.responseText);

        return jsonObject;
    } catch (err) {
        return null;
    }
}