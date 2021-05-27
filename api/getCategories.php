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
    
    $query = "SELECT category_id, text, owner FROM category_translation WHERE ((language = '" . $language 
        . "' OR language='met') AND owner = 0) OR (owner = " . $userID . ");";
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $query . '"}';
        return;
    }

    $arr = array();
	while ($row = $result->fetch_assoc()) {
		$arr[] = array('cat_id' => $row["category_id"], 'text' => $row["text"], 'owner' => $row["owner"]);
	}
	echo '{"categories":' . json_encode($arr) . '}';

?>