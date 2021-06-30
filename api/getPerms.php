<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$user = $inputData["username"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "SELECT permission_level FROM users WHERE username = '" . $user . "';";
	$result = mysqli_query($conn, $query);

	if($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		echo '{"permission_level":' . $row["permission_level"] . ', "error":""}';
	}
	else {
		echo '{"error":"User not found."}';
	}
?>
