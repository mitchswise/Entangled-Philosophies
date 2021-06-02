<?php
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Origin: *");
    include "database.php";
    
    $conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

    $inData = json_decode(file_get_contents('php://input'), true);
    
    $tag_list = $inData["delete"];
    $tag_list_len = count($tag_list);
    $query = "DELETE FROM saved_queries WHERE ";

    for($idx = 0; $idx < $tag_list_len; $idx++) {
        if($idx > 0) $query = $query . " OR ";
        $query = $query . " id = " . $tag_list[$inData];
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    echo '{"status":"success"}';
?>