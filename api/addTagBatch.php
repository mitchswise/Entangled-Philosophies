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
    $language = $inData["language"];
    $arr = $inData["tagsArray"];
    $arr_len = count($arr);

    //identify all category ids first
    $category_to_id = array();
    $query = "SELECT category_id, text FROM category_translation WHERE ";

    for($i = 0; $i < $arr_len; $i++) {
        if($i > 0) $query = $query . " OR ";
        $query = $query . "(text='" . $arr[$i]["category"] . "' AND language='" . $language . "')";
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    while($row = $result->fetch_assoc()) {
        if(!array_key_exists($row["text"], $category_to_id)) {
            $category_to_id[$row["text"]] = $row["category_id"];
        }
    }

    for($i = 0; $i < $arr_len; $i++) {
        $cur_category = $category_to_id[$arr[$i]["category"]];
        $query = "INSERT INTO tags(owner_id, category_id) VALUES (" . $userID . ", " . $cur_category . ");";
        $result = $conn->query($query);
        $tag_id = $conn->insert_id;

        $query = "INSERT INTO tags_translation (tag_id, language, text, owner) VALUES ";
        $inserted = 0;

        foreach($arr[$i] as $_key => $_value) {
            if($_key == 'category') continue;
            
            if($inserted > 0) {
                $query = $query . ", ";
            }

            $query = $query . "(" . $tag_id . ", '" . $_key . "', '" . $_value . "', " . $userID . ")";
            $inserted++;
        }

        $result = $conn->query($query);
        if(!$result) {
            echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
            return;
        }
    }
    
    echo '{"status":"success"}';
?>