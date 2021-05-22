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
    $tag_id = $inData["tag_id"];

    $query = "SELECT language, text FROM tags_translation WHERE tag_id = " . $tag_id . ';';
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    $arr = array();
    $arr["status"] = "success";
    while($row = $result->fetch_assoc()) {
        $arr[$row["language"]] = $row["text"];
    }

    return json_encode($arr);
?>