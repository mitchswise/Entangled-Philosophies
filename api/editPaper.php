<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

    $conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);
    $query = "UPDATE papers SET ";

    $metadata_appended = 0;
    foreach($inData as $arr_key => $arr_value) {
        if($arr_key == "id") continue;
        if($metadata_appended > 0) $query = $query . ", ";

        if(strlen($arr_value) == 0) {
            $query = $query . $arr_key . " = NULL";
        }
        else {
            $query = $query . $arr_key . " = '" . $arr_value . "'";
        }
        $metadata_appended++;
    }
    $query = $query . " WHERE id = " . $inData["id"] . ";";

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    echo '{"status":' . $conn->affected_rows . ', "query":"' . $query . '"}';

?>