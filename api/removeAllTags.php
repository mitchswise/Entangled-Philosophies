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

    // delete all tag translations
    $query = "DELETE FROM tags_translation WHERE owner = " . $userID . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    // delete all tags
    $query = "DELETE FROM tags WHERE owner_id = " . $userID . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    // delete all category translations
    $query = "DELETE FROM category_translation WHERE owner = " . $userID . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    // delete all categories
    $query = "DELETE FROM category WHERE owner = " . $userID . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    echo '{"status":"successfully deleted all user tags and categories"}';
?>
