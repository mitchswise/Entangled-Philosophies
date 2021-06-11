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
    
    $is_category_metadata = array();
    $query = "SELECT id, is_metadata FROM category WHERE (owner = 0 OR owner = " . $userID . ");";
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    while($row = $result->fetch_assoc()) {
        $is_category_metadata += [$row["id"] => $row["is_metadata"]];
    }

    //select all categories that this user can view
    $query = "SELECT category_id, text FROM category_translation WHERE (owner = 0 AND (language = '" . $language . 
    "' OR language='met')) OR (owner = " . $userID . " AND language = 'def');";
    $result = $conn->query($query);
    
    //map category_id -> cateogory_text (the real word)
    $catID_to_word = array();
    if(!$result) {
        echo '{"status":"' . $result->conn_error . '"}';
        return;
    }
    
    while ($row = $result->fetch_assoc()) {
        $catID_to_word += [$row["category_id"] => $row["text"]];
	}
    
    $query = "SELECT id, category_id FROM tags WHERE (owner_id = 0 OR owner_id = " . $userID . ");";
    $result = $conn->query($query);
    
    //map tag_id -> cat_id
    $tagID_to_catID = array();
    if(!$result) {
        echo '{"status":"' . $result->conn_error . '"}';
        return;
    }

    while ($row = $result->fetch_assoc()) {
        $tagID_to_catID += [$row["id"] => $row["category_id"]];
	}

    //collect frequency for all tags this user can see
    $query = "SELECT tag_id, COUNT(tag_id)AS frequency FROM paper_tags WHERE (owner = 0 OR owner=" . $userID . ") GROUP BY tag_id";
    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $result->conn_error . ' : error with getting tag frequencies"}';
        return;
    }

    $tagID_to_frequency = array();
    while($row = $result->fetch_assoc()) {
        $tagID_to_frequency += [$row["tag_id"] => $row["frequency"]];
    }
    
    //select all tags this user can see
    $query = "SELECT tag_id, text, owner FROM tags_translation WHERE (owner = 0 AND (language = '" . $language . 
    "' OR language='met')) OR (owner = " . $userID . " AND language = 'def');";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    $arr = array();
	while ($row = $result->fetch_assoc()) {
        $catID = $tagID_to_catID[$row["tag_id"]];
        $catText = $catID_to_word[$catID];
        $frequency = "0";
        if(array_key_exists($row["tag_id"], $tagID_to_frequency)) {
            $frequency = $tagID_to_frequency[$row["tag_id"]];
        }

		$arr[] = array('tag_id' => $row["tag_id"], 'text' => $row["text"], 'owner' => $row["owner"], 
                        'cat_id' => $catID, 'catText' => $catText, 'frequency' => $frequency, 'is_metadata' => $is_category_metadata[$catID]);
	}
	echo '{"tags":' . json_encode($arr) . '}';

?>