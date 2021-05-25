const url = "http://chdr.cs.ucf.edu/~al657032/Entangled-Philosophies/api/uploadPaper.php";
const form = document.querySelector('form');
form.addEventListener('submit', e => {
	e.preventDefault();
	const files = document.querySelector('[name=file]').files;
	const formData = new FormData();
	formData.append('paper', files[0]);
	
	console.log(files[0]); // Debug
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	
	xhr.onload = () => {
		console.log(xhr.response);
	};

	xhr.open('POST', url);
	xhr.send(formData);
	
});
