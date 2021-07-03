<?php
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Origin: *");
    include "database.php";
    include "languages.php";

    $conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

    $inData = json_decode(file_get_contents('php://input'), true);
    $userID = $inData["id"];

    // does the user exist?
    $query = "SELECT permission_level FROM users WHERE id = " . $userID . ";";
    $result = $conn->query($query);

    if($result->num_rows == 0) {
        $message = '{"status":"user does not exist"}';
        echo $message;
        return;
    }
	
	$query = "DELETE FROM saved_queries WHERE owner = " . $userID . ";";
	$result = $conn->query($query);

	if(!$result) {
		$message = '{"status":"' . $conn->error . '"}';
		echo $message;
		return;
	}	

	// remove account
	$query = "DELETE FROM users WHERE id = " . $userID . ";";
	$result = $conn->query($query);

	if(!$result) {
		$message = '{"status":"' . $conn->error . '"}';
		echo $message;
		return;
	}

	echo '{"status":"successfully deleted user"}';
?>
