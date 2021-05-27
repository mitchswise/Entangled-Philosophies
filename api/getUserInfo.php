<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$id = $inputData["id"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "SELECT username, permission_level, email, language, cookies FROM users WHERE id = " . $id . " ;";
	$result = mysqli_query($conn, $query);

	if($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		echo '{"username":"' . $row["username"] . '", "permission_level":' . $row["permission_level"] . ', "email":"' . $row["email"] . '", "language":' . $row["cookies"] . '}';
	} else {
		echo '{"status":"' . $conn->error . '"}';
	}
?>
