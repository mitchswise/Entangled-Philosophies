<?php
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Origin: *");
    include "database.php";
    
    $inData = json_decode(file_get_contents('php://input'), true);
    $owner = $inData["owner"];
    $query_type = $inData["query_type"];
    $is_history = $inData["is_history"];
    $query_text = $inData["query_text"];
    $name = $is_history == 0 ? $inData["name"] : "";
    
    $conn = new mysqli($host, $username, $password, $dbname);
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
	}

    $query = "";
    if($is_history == 0) {
        $query = "INSERT INTO saved_queries (owner, name, date, query_type, query_text, is_history) VALUES (" .
            $owner . ", '" . $name . "', now(), '" . $query_type . "', '" . addslashes($query_text) . "', " . $is_history . ");";
    }
    else {
        $query = "INSERT INTO saved_queries (owner, date, query_type, query_text, is_history) VALUES (" .
            $owner . ", now(), '" . $query_type . "', '" . addslashes($query_text) . "', " . $is_history . ");";
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    echo '{"status":"success"}';
?>