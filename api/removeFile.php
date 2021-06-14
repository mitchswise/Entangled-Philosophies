<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	include "database.php";

    $conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);

    if($inData["url"] != "none") { //Upload already exists
        $query = "SELECT url FROM papers WHERE id = " . $inData["id"] . ";";
        $result = $conn->query($query);
        if(!$result) {
            echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
            return;
        }
        if($result->num_rows == 0) {
            echo '{"status":"paper does not exist"}';
            return;
        }

        $row = $result->fetch_assoc();
        if($row["url"] != "none") {
            //need to unlink this file
            $full_URL = $paperurl . $inData["url"];
            unlink($full_URL);
        }
    	$query = "UPDATE papers SET url = 'none' WHERE id = " . $inData["id"] . ";";

   		$result = $conn->query($query);
  	 	if(!$result) {
        	echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        	return;
   		}

    	echo '{"status":' . $conn->affected_rows . ', "query":"' . $query . '"}';
    }
?>
