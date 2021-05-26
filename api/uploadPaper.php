<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

	if (isset($_FILES['file'])) {
		$target_path = $paperurl . basename($_FILES['file']['name']);
		
		if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
			echo '{"status":"The file ' . basename($_FILES['file']['name']) . ' has been uploaded"}';
		} else {
			echo '{"status":"There was an error uploading the file"}';
		}
	} else {
		if ($_FILES['file']['error'] == 0) {
			echo '{"status":"File not found"}';
		} else {
			echo '{"status":"' . $_FILES['file']['error'] . '"}';
		}
	}
?>
