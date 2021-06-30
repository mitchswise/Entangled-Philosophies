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
    $valid_ids = $inData["papers"];

    $ids_len = count($valid_ids);
    $query = "SELECT tag_id, COUNT(tag_id)AS frequency FROM paper_tags WHERE (owner = 0 OR owner=" . $userID . ") AND (";
    for($i = 0; $i < $ids_len; $i++) {
        if($i > 0) $query = $query . " OR ";
        $query = $query . "paper_id = " . $valid_ids[$i];
    }
    $query = $query . ") GROUP BY tag_id;";

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $result->conn_error . ' : ' . $query . '"}';
        return;
    }

    $tagID_to_frequency = array();
    while($row = $result->fetch_assoc()) {
        $tagID_to_frequency += [$row["tag_id"] => $row["frequency"]];
    }

    $query = "SELECT tag_id, text, owner FROM tags_translation WHERE (owner = 0 AND (language = '" . $language . 
    "' OR language='met')) OR (owner = " . $userID . " AND language = 'def');";
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $result->conn_error . ' : ' . $query . '"}';
        return;
    }

    $arr = array();
    while($row = $result->fetch_assoc()) {
        if(array_key_exists($row["tag_id"], $tagID_to_frequency)) {
            $arr[] = array('text' => $row["text"], 'value' => $tagID_to_frequency[$row["tag_id"]] );
        }
    }

    echo '{"tags":' . json_encode($arr) . '}';
?>