<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	ini_set('display_errors', 1);
	error_reporting(E_ALL ^ E_NOTICE);	
	include "database.php";
	
	$inputData = json_decode(file_get_contents('php://input'), true);
	
	$user = $inputData["username"];
	$perms = $inputData["permission_level"];
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "UPDATE users SET permission_level = " . $perms . "  WHERE username = '" . $user . "';";
	$result = mysqli_query($conn, $query);

	if(mysqli_affected_rows($conn) > 0) {
		echo '{"status":"success"}';
	} else {
		echo '{"status":"error"}';
	}
?>
