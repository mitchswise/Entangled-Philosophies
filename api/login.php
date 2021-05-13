<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$_username = $inputData["username"];
	$_password = $inputData["password"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "SELECT username, password, id, is_verified FROM users WHERE username = '" . $_username . "';";
	$result = mysqli_query($conn, $query);

	$error_code = 0;
	$user_id = -1;
	
	if($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		#if(password_verify($_password, $row["password"])) {
		if($_password == $row["password"]) {
			$user_id = $row["id"];
			if($row["is_verified"] == 0) {
				$error_code = 2;
			}
		}
		else {
			$error_code = 1;
		}
	}
	else {
		$error_code = 1;
	}
	
	$error_message = "";
	if($error_code == 1) $error_message = "Username/Password combination does not exist.";
	else if($error_code == 2) $error_message = "Account not activated";

	$ret_value = '{"UserID": ' . $user_id . ', "error_code": ' . $error_code . ', "error_message": "' . $error_message . '"}';
	echo $ret_value;
?>
