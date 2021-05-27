const url = "http://chdr.cs.ucf.edu/~al657032/Entangled-Philosophies/api/uploadPaper.php";
const form = document.querySelector('form');
form.addEventListener('submit', e => {
	e.preventDefault();
	const files = document.querySelector('[name=file]').files;
	const formData = new FormData();
	formData.append('file', files[0]);

	var jsonObject;

	fetch(url, {
		method: 'POST',
		body: formData
	}).then(response => response.text())
	  .then(data => jsonObject = JSON.parse(data))
	  .then(json => {
		document.getElementById("filename").value = json.url;
		document.getElementById("uploadStatus").innerHTML = "Uploaded " + json.url + " with status " + json.status;
	  });
});
