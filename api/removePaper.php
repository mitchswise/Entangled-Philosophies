<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);
	$id = $inData["id"];

	$sql = 'SELECT url FROM papers WHERE id = ' . $id . ';';
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();	
		if ($row["url"] != 'none') {
			$url = '/home/entangledPhilosophy/public_html/paper/' . $row["url"];
			if (!unlink($url)) {
				echo '{"status":"File not found", "url":"' . $url . '"}';
			}
		}

		$sql = 'DELETE FROM papers WHERE id = ' . $id . ';';
		$result = $conn->query($sql);
		
		if ($conn->affected_rows > 0) {
			echo '{"status":"success"}';
		} else {
			echo '{"status":"' . $conn->error . '"}'; 	
		}
	} else {
		echo '{"status":"' . $conn->error . '"}'; 	
	}
?>
