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
    $userID = $inData["userID"];
    $query = $inData["query"];

    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    $arr = array();
	while ($row = $result->fetch_assoc()) {
		$arr[] = array('paper_id' => $row["paper_id"]);
	}

    echo json_encode($arr);
?>
