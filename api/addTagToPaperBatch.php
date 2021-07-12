<?php
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Origin: *");
    include "database.php";
    include "languages.php";

    $conn = new mysqli($host, $username, $password, $dbname);
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
	}

    $inData = json_decode(file_get_contents('php://input'), true);
    $paper_id = $inData["paper_id"];
    $userID = $inData["userID"]; //0 if admin, > 0 otherwise
    $arr = $inData["tagsArray"];
    $arr_len = count($arr);

    $query = "INSERT INTO paper_tags (paper_id, tag_id, owner) VALUES ";
    for($i = 0; $i < $arr_len; $i++) {
        if($i > 0) $query = $query . ", ";
        $query = $query . "(" . $paper_id . ", " . $arr[$i]["tag_id"] . ", " . $userID . ")";
    }
    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    echo '{"status":"Successfully added tag to paper"}';
?>