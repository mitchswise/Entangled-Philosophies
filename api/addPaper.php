<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);

	$query = "INSERT INTO papers ";
	$columns_insert = "";
	$columns_values = "";

	foreach($inData as $inData_key => $inData_value) {
		if(strlen($columns_insert) > 0) {
			$columns_insert = $columns_insert . ", ";
			$columns_values = $columns_values . ", ";
		}

		$columns_insert = $columns_insert . $inData_key;
		$columns_values = $columns_values . "'" . $inData_value . "'";
	}

	$query = $query . "(" . $columns_insert . ") VALUES (" . $columns_values . ");";
	$result = $conn->query($query);

	if ($conn->affected_rows > 0) {
		$new_id = $conn->insert_id;
		echo '{"status":"success", "id":' . $new_id . '}';
	} else {
		echo '{"status":"' . $conn->error . '", "id":-1}';
	}
?>
