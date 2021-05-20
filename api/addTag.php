<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

    $inData = json_decode(file_get_contents('php://input'), true);
    $userID = $inData["userID"];
    $language = $inData["language"];

    //check for invalid category
    $category_name = $inData["category"];
    $category_id = -1;

    $query = "SELECT category_id FROM category_translation WHERE language = '" . $language . "' AND text = '" . $category_name . "'
            AND owner = " . $userID . ";";
    $result = $conn->query($query);
    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $category_id = $row["category_id"];
    }
    else {
        $message = '{"status":"category does not exist."}';
        echo $message;
        return;
    }

    $message = '{"status":"success"}';
    echo $message;

?>