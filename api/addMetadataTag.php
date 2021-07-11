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
    $category = addslashes($inData["category"]);
    $language = $inData["language"]; //language of category
    $text = addslashes($inData["text"]);
    $tag_id = $inData["tag_id"]; //-1 if inserting metadata tag
    $category_id = -1;

    $query = "SELECT category_id FROM category_translation WHERE language = '" . $language . "' AND text = '" . 
                    $category . "' AND owner = 0;";
    $result = $conn->query($query);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $category_id = $row["category_id"];
    }
    else {
        echo '{"status":"Metadata category does not exist"}';
        return;
    }

    if($tag_id == -1) { //new metadata
        //can't have duplicate tag text
        $query = "SELECT tag_id FROM tags_translation WHERE text = '" . $text . "' AND owner = 0;";
        $result = $conn->query($query);
        
        if($result->num_rows > 0) {
            echo '{"status":"Tag name already exists"}';
            return;
        }

        $query = "INSERT INTO tags (owner_id, category_id) VALUES (0, " . $category_id . ");";
        $result = $conn->query($query);
        $inserted_tag = $conn->insert_id;

        $query = "INSERT INTO tags_translation (tag_id, language, text, owner) VALUES (" . $inserted_tag .
            ", 'met', '" . $text . "', 0);";
        $result = $conn->query($query);

        if(!$result) {
            echo '{"status":"' . $conn->error . '"}';
            return;
        }

        echo '{"status":"Successfully added metadata tag"}';

    }
    else { //edit existing metadata
        $query = "SELECT tag_id FROM tags_translation WHERE text = '" . $text . "' AND tag_id != " . $tag_id . " AND owner = 0;";
        $result = $conn->query($query);
        
        if($result->num_rows > 0) {
            echo '{"status":"New tag name already exists"}';
            return;
        }

        $query = "UPDATE tags_translation SET text = '" . $text . "' WHERE tag_id = " . $tag_id . ";";
        $result = $conn->query($query);

        if(!$result) {
            echo '{"status":"' . $conn->error . '"}';
            return;
        }

        echo '{"status":"Successfully edited metadata tag"}';
    }

?>