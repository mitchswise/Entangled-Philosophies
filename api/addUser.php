<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);
	$hashed_password = password_hash($inData["password"], PASSWORD_DEFAULT);
	$activation_code = generateCode(4);
	$preferred_language = $inData["language"];

	$sql = "SELECT username FROM users WHERE username = '" . $inData["username"] . "';";
	$result = $conn->query($sql);
	if($result->num_rows > 0) {
		echo '{"status": "username already exists"}';
	}
	else {
		$sql = 'INSERT INTO users (username, email, password, language, activation_code) VALUES ("' .
			$inData["username"] . '", "' . $inData["email"] . '", "' . $hashed_password . '", "' 
			. $preferred_language . '", ' . $activation_code . ')';
		$result = $conn->query($sql);
	
		if ($result) {
			echo '{"status":"success"}';
		} else {
			echo '{"status":"' . $conn->error . '"}'; 	
		}
	}


	//generates random string of digits of specified length
	function generateCode( $code_len ) {
		$code = '';
		for($digit = 0; $digit < $code_len; $digit++) {
			$next_digit = rand(0, 9);
			$code = $code.strval($next_digit);
		}
		return $code;
	}

?>
