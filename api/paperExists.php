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
    $title = $inData["title"];
    $author = $inData["author"];

    $query = "SELECT id FROM papers WHERE title = " . $title . " AND author = '" . $author . "';";
    $result = $conn->query($query);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo '{"exists":true, "id":' . $row["id"] . '}';
        return;
    }

	echo '{"exists":false}';
?>
