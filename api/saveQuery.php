<?php
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Origin: *");
    include "database.php";
    
    $inData = json_decode(file_get_contents('php://input'), true);
    $owner = $inData["owner"];
    $query_type = $inData["query_type"];
    $is_history = $inData["is_history"];
    $query_text = addslashes($inData["query_text"]);
    $display_query = addslashes($inData["display_query"]);
    $name = $is_history == 0 ? addslashes($inData["name"]) : "";
    
    $conn = new mysqli($host, $username, $password, $dbname);
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
	}

    $query = "";
    if($is_history == 0) {
        $query = "INSERT INTO saved_queries (owner, name, date, query_type, query_text, is_history, display_query) VALUES (" .
            $owner . ", '" . $name . "', now(), '" . $query_type . "', '" . $query_text . "', " . $is_history . 
            ", '" . $display_query . "');";
    }
    else {
        $query = "INSERT INTO saved_queries (owner, date, query_type, query_text, is_history, display_query) VALUES (" .
            $owner . ", now(), '" . $query_type . "', '" . $query_text . "', " . $is_history . 
            ", '" . $display_query . "');";
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    echo '{"status":"success"}';
?>