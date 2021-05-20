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

    //check for invalid category
    $category_name = $inData["category"];
    $category_id = -1;

    $query = "SELECT category_id FROM category_translation WHERE language = '" . $language . "' AND text = '" . 
                $category_name . "' AND owner = " . $userID . ";";
    $result = $conn->query($query);
    if(!$result) {
        $message = '{"status":"' . $conn->error . '"}';
        echo $message;
        return;
    }

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $category_id = $row["category_id"];
    }
    else {
        $message = '{"status":"category does not exist."}';
        echo $message;
        return;
    }

    //now we have a category id to assign the tag to.
    //check if there are any name conflicts with this tag.

    $duplicate_tag = FALSE;
    if($userID == 0) { //Admin tag

        //admins can't have any overlap for each of the supported languages
        $lang_len = count(supported_languages);
        $query = "SELECT * FROM tags_translation WHERE ";
        for($idx = 0; $idx < $lang_len; $idx++) {
            if($idx > 0) $query = $query . " OR ";
            $cur_lang = supported_languages[$idx];
            $query = $query . "(text = " . $inData[$cur_lang] . " AND language = '" . 
		        $cur_lang . "' AND owner = 0)";
        }
        $query = $query . ";";

        $result = $conn->query($query);
        if($result->num_rows > 0) {
            $duplicate_tag = TRUE;
        }
    }
    else { //User tag
        $tag_name = $inData["userLang"];

        //users cant have overlap with any of their own tags
        $query = "SELECT * FROM tags_translation WHERE text = '" . $tag_name . "' AND owner = " . $userID . ";";
        $result = $conn->query($query);

        if($result->num_rows > 0) {
            $duplicate_tag = TRUE;
        }
    }

    if($duplicate_tag == TRUE) {
        echo '{"status":"duplicate tag name."}';
        return;
    }

    //now insert the tag 
    // $query = "INSERT INTO tags (owner_id, category_id) VALUES (" . $userID . ", " . $category_id . ");";
    // $result = $conn->query($query);
    // $tag_id = $conn->insert_id;
    
    $message = '{"status":"Success!"}';
    echo $message;

?>