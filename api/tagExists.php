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
    $text = $inData["text"];
    $language = $inData["language"];
    $userID = $inData["userID"];

    if($userID > 0) { //check for a user-created tag first
        $query = "SELECT tag_id FROM tags_translation WHERE owner = " . $userID . " AND text = '" . $text . "';";
        $result = $conn->query($query);

        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo '{"tag_id":' . $row["tag_id"] . '}';
            return;
        }
    }

    $query = "SELECT tag_id FROM tags_translation WHERE owner = 0 AND text = '" . $text . "' AND language = '" . $language . "';";
    $result = $conn->query($query);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo '{"tag_id":' . $row["tag_id"] . '}';
        return;
    }

    echo '{"tag_id": -1}';
?>