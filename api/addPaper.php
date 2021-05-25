<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);
	$title = $inData["title"];
	$author = $inData["author"];
	$url = $inData["url"];
	
	$sql = 'INSERT INTO papers (title, author, url) VALUES ("' .
		$title . '", "' . $author . '", "' . $url . '")';
	$result = $conn->query($sql);

	if ($conn->affected_rows > 0) {
		echo '{"status":"success"}';
	} else {
		echo '{"status":"' . $conn->error . '"}'; 	
	}
?>
