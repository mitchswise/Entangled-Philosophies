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
    $cat_name = $inData["name"];

    //does the category exist?
    $query = "SELECT category_id FROM category_translation WHERE owner = " . $userID . " AND language = '" . $language . "' AND text = '" . $cat_name . "';";
    $result = $conn->query($query);

    
    if($result->num_rows == 0) {
        $message = '{"status":"category does not exist"}';
        echo $message;
        return;
    }
    
    $row = $result->fetch_assoc();
    $cat_id = $row["category_id"];
    
    //find all tags that have this category
    $query = "SELECT id FROM tags WHERE category_id = " . $cat_id . ";";
    $result = $conn->query($query);
    
    //remove all translations
    $query = "DELETE FROM tags_translation WHERE (";
    $num_tags = 0;
    while ($row = $result->fetch_assoc()) {
        if($num_tags > 0) $query = $query . " OR ";
        
        $tag_to_remove = $row["id"];
        $query = $query . "(tag_id = " . $tag_to_remove . ")";
        $num_tags++;
    }
    $query = $query . ");";

    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    //remove all tag entries from tag table
    $query = "DELETE FROM tags WHERE category_id = " . $cat_id . ";";
    $result = $conn->query($query);

    //remove from category_translation table
    $query = "DELETE FROM category_translation WHERE category_id = " . $cat_id . ";";
    $result = $conn->query($query);

    //remove category entry from table
    $query = "DELETE FROM category WHERE id = " . $cat_id . ";";
    $result = $conn->query($query);

    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    

    echo '{"status":"successfully deleted category"}';
?>