<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	
	include "database.php";
	
	$conn = mysqli_connect($host, $username, $password, $dbname);
	if($conn->connect_error) {
		die("Connection failed " . $conn->connect_error);
	}
	
	$query = "SELECT username, id FROM users WHERE permission_level > 0;";
	$result = mysqli_query($conn, $query);

	$arr = array();
	while ($row = $result->fetch_assoc()) {
		$arr[] = array('username' => $row["username"], 'id' => $row["id"]);
	}
	echo '{"admins":' . json_encode($arr) . '}';
?>
