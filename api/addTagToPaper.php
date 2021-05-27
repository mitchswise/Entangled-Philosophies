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
    $paper_id = $inData["paper_id"];
    $tag_id = $inData["tag_id"];
    $userID = $inData["userID"]; //0 if admin, > 0 otherwise

    $query = "SELECT * FROM paper_tags WHERE paper_id = " . $paper_id . " AND tag_id = " . $tag_id .
        " AND owner = " . $userID . ";";
    $result = $conn->query($query);

    if($result->num_rows > 0) { 
        echo '{"status":"Adding duplicate tag to paper"}';
        return;
    }

    $query = "INSERT INTO paper_tags (paper_id, tag_id, owner) VALUES (" . 
        $paper_id . ", " . $tag_id . ", " . $userID . ");";
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
    }
    else {
        echo '{"status":"Successfully added tag to paper"}';
    }

?>