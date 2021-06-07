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
    $user_id = $inData["userID"];
    $paper_id = $inData["paperID"];
    $language = $inData["language"];

    $query = "SELECT tag_id, owner FROM paper_tags WHERE paper_id = " . $paper_id . 
        " AND (owner = 0 OR owner = " . $user_id . ");";
    $result = $conn->query($query);

    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }

    $tag_to_owner = array();
    
    
    $query = "SELECT text, tag_id from tags_translation WHERE ";
    $tags_appended = 0;
    
    while($row = $result->fetch_assoc()) {
        $tag = $row["tag_id"];
        $owner = $row["owner"];
        if(array_key_exists($tag, $tag_to_owner)) {
            if($owner > 0) $tag_to_owner[$tag] = $owner;
        }
        else {
            $tag_to_owner[$tag] = $owner;
        }
        
        if($tags_appended > 0) $query = $query . " OR ";
        
        $next_term = "(tag_id = " . $row["tag_id"] . " AND (language = '" . $language . "' OR language='def'))";
        $query = $query . $next_term;
        $tags_appended++;
    }
    
    $result = $conn->query($query);
    if(!$result) {
        echo '{"status":"' . $conn->error . '", "query":"' . $query . '"}';
        return;
    }
    
    $arr = array();
    while($row = $result->fetch_assoc()) {
        $arr[] =  array('text' => $row["text"], 'tag_id' => $row["tag_id"], 'owner' => $tag_to_owner[$row["tag_id"]]);
    }
    echo '{"tags":' . json_encode($arr) . '}';
?>
