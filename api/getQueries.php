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
	$userID = $inData["owner"];
    
    $query = "SELECT * FROM saved_queries WHERE owner = " . $userID . ";";
    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }
    
    $allQueries = array();
    $index = 0;
    
    while($row = $result->fetch_assoc()) {
        $allQueries[$index] = $row;
        $index++;
    }

    echo '{"queries":' . json_encode($allQueries) . '}';
?>