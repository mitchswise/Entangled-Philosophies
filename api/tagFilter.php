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
    $user_id = $inData["userID"];

    //first get all valid papers
    $query = "SELECT DISTINCT paper_id FROM paper_tags";
    $arr_len = count($inData["tags"]);

    if($arr_len > 0) $query = $query . " WHERE";
    for($idx = 0; $idx < $arr_len; $idx++) {
        if($idx > 0) $query = $query . " AND";
        $next_query = " paper_id IN (SELECT paper_id FROM paper_tags WHERE (tag_id = " . 
            $inData["tags"][$idx] . " AND (owner = 0 OR owner = " . $user_id .  ")))";
        $query = $query . $next_query;
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    if($result->num_rows == 0) {
        echo '{"tags": []}';
        return;
    }
    $query = "SELECT DISTINCT tag_id FROM paper_tags WHERE";
    $papers_added = 0;

    while($row = $result->fetch_assoc()) {
        if($papers_added > 0) $query = $query . " OR";
        $query = $query . " (paper_id = " . $row["paper_id"] . " AND (owner = 0 OR owner = " . $user_id . ")";
        $papers_added++;
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    
    $valid_tags = array();
    $arr_index = 0;
    while($row = $result->fetch_assoc()) {
        $valid_tags[] = array($arr_index => $row["tag_id"]);
    }
    
    echo '{"tags":' . json_encode($valid_tags) . '}';
?>