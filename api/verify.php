<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$username = $inputData["username"];
	$activation_code = $inputData["activation_code"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "UPDATE users SET is_verified = 1 WHERE username = '" . $_username . "' AND activation_code = '" . $activation_code . "';";
	$result = mysqli_query($conn, $query);

	if(mysqli_affected_rows($conn) > 0) {
		echo '{"status":"success"}';
	}
	else {
		echo '{"status":"failure"}';
	}
?>
