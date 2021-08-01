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
    $arr = $inData["tagsArray"];
    $user_id = $inData["userID"];
    $language = $inData["language"];
    $arr_len = count($arr);

    $text_to_tag = array();

    $query = "";
    if($user_id > 0) {
        //make a query to find all input tags that are user-made tags
        $query = "SELECT tag_id, text FROM tags_translation WHERE ";
        for($i = 0; $i < $arr_len; $i++) {
            if($i > 0) $query = $query . " OR ";
            $add = "(owner = " . $user_id . " AND language='def' AND text='" . addslashes($arr[$i]["text"]) . "')";
            $query = $query . $add;
        }
        
        $result = $conn->query($query);
        if(!$result) {
            echo '{"status":"' . $conn->error . '"}';
            return;
        }

        while($row = $result->fetch_assoc()) {
            if(!array_key_exists($row["text"], $text_to_tag)) {
                $text_to_tag[$row["text"]] = $row["tag_id"];
            }
        }
    }

    //make a query to find all remaining unidentified tags (assume owned by admin)
    $query = "SELECT tag_id, text FROM tags_translation WHERE ";
    for($i = 0; $i < $arr_len; $i++) {
        if($i > 0) $query = $query . " OR ";
        $add = "(owner = 0 AND (language='" . $language . "' OR language='met') AND text = '" . addslashes($arr[$i]["text"]) . "')";
        $query = $query . $add;
    }

    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '"}';
        return;
    }

    while($row = $result->fetch_assoc()) {
        if(!array_key_exists($row["text"], $text_to_tag)) {
            $text_to_tag[$row["text"]] = $row["tag_id"];
        }
    }

    for($i = 0; $i < $arr_len; $i++) {
        $tag_text = $arr[$i]["text"];
        if(!array_key_exists($tag_text, $text_to_tag)) {
            $text_to_tag[$tag_text] = "-1";
        }
    }

    echo '{"tags":' . json_encode($text_to_tag) . '}';
?>