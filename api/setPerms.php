<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$username = $inputData["username"];
	$perms = $inputData["permission_level"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "UPDATE users SET permission_level = . $perms . WHERE username = '" . $username . "';";
	$result = mysqli_query($conn, $query);

	if($result->affected_rows > 0) {
		echo '{"status":"success"}';
	}
	else {
		echo '{"status":"error"}';
	}
?>
