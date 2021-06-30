<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include 'database.php';

	$conn = new mysqli($host, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);

	$id = $inData["id"];
	$new_pass = $inData["password"];
	
	//change the password
	$sql = "UPDATE users SET password = '" . password_hash($new_pass, PASSWORD_DEFAULT) . "' WHERE id = " . $id . ";";
	$result = $conn->query($sql);

	if ($conn->affected_rows > 0) {
		echo '{"status":"Password has been updated.", "error":0}';
	} else {
		echo '{"status":"Error changing password.", "error":1}';
	}
?>
