<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$id = $inputData["id"];
	$email = $inputData["email"];
	$language = $inputData["language"];
	$cookies = $inputData["cookies"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "UPDATE users SET email = '" . $email . "', language = '" . $language . "', cookies = " . $cookies . " WHERE id = " . $id . ";";
	$result = mysqli_query($conn, $query);

	if(mysqli_affected_rows($conn) > 0) {
		echo '{"status":"success"}';
	} else {
		echo '{"status":"' . $conn->error . '"}';
	}
?>
