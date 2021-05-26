const url = "http://chdr.cs.ucf.edu/~al657032/Entangled-Philosophies/api/uploadPaper.php";
const form = document.querySelector('form');
form.addEventListener('submit', e => {
	e.preventDefault();
	const files = document.querySelector('[name=file]').files;
	const formData = new FormData();
	formData.append('file', files[0]);
	
	console.log(files[0]); // Debug
	const xhr = new XMLHttpRequest();	

	xhr.open('POST', url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.send(formData);
		var jsonObject = JSON.parse(xhr.responseText);
		console.log(jsonObject.status);	
	} catch (err) {
		console.log(xhr.responseText);
	}
});
