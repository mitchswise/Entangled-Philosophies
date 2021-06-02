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

    $query = "SELECT * FROM saved_queries WHERE owner = " . $userID . ";";
    $result = $conn->query($query);

    $allQueries = array();
    $index = 0;

    while($row = $result->fetch_assoc()) {
        $allQueries[$index] = $row;
        $index++;
    }

    return '{"queries":' . json_encode($allQueries) . '}';
?>