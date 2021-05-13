<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$_username = $inputData["username"];
	$_password = $inputData["password"];
	
	$conn = mysqli_connect($host, $user, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "SELECT username, password, id FROM users WHERE username = '" . $_username . "';";
	$result = mysqli_query($conn, $query);
	$error = false;
	$user_id = -1;
	
	if($result->num_rows > 0) {
	#if(true)
		$row = $result->fetch_assoc();
		
		#if(password_verify($_password, $row["password"])) {
		#	$user_id = $row["id"];
		#}
		if($_password == $row["password"]) {
			$user_id = $row["id"];
			$user_id = 3;
		}
		else {
			$error = true;
			$user_id = 2;
		}
	}
	else {
		$error = true;
		$user_id = 1;
	}
	
	$ret_value = '{"UserID": ' . $user_id . '}';
	echo $ret_value;
	
?>
