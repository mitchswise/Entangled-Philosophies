<?php
    header("Access-Control-Allow-Headers: Content-type");
    header("Access-Control-Allow-Origin: *");
    include "database.php";

    $MAX_HISTORY_PER_USER = 10;

    $inData = json_decode(file_get_contents('php://input'), true);
    $owner = $inData["owner"];

    $conn = new mysqli($host, $username, $password, $dbname);
	if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
	}

    $query = "SELECT id FROM saved_queries WHERE owner = " . $owner . " AND is_history = 1 ORDER BY date ASC";
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    $removed_count = 0;
    if($result->num_rows > $MAX_HISTORY_PER_USER) {
        $removed_count = $result->num_rows - $MAX_HISTORY_PER_USER;
        $to_remove = $removed_count;

        $query = "DELETE FROM saved_queries WHERE ";
        while($row = $result->fetch_assoc()) {
            if($to_remove == 0) break;
            if($to_remove < $removed_count) $query = $query . " OR ";

            $delete_id = $row["id"];
            $query = $query . "id = " . $delete_id;

            $to_remove--;
        }

        $result = $conn->query($query);
        if(!$result) {
            echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
            return;
        }
    }

    echo '{"status":"success", "removed_count":' . $removed_count . '}';
?>