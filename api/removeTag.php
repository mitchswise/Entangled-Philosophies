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
    $userID = $inData["userID"];
    $language = $inData["language"];
    $tag_name = $inData["name"];

    //does the tag exist?
    $query = "SELECT tag_id FROM tags_translation WHERE owner = " . $userID . " AND language = '" . $language . "' AND text = '" . $tag_name . "';";
    $result = $conn->query($query);

    if($result->num_rows == 0) {
        $message = '{"status":"tag does not exist"}';
        echo $message;
        return;
    }
    $row = $result->fetch_assoc();
    $tag_id = $row["tag_id"];

    //remove all translations
    $query = "DELETE FROM tags_translation WHERE tag_id = " . $tag_id . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    //remove tag entry from table
    $query = "DELETE FROM tags WHERE id = " . $tag_id . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    echo '{"status":"successfully deleted tag"}';
?>