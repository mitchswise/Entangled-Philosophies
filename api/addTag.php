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
    $edit_tag = $inData["edit_tag"]; //-1 if we're inserting, not 0 means it's the tag id

    //check for invalid category
    $category_name = $inData["category"];
    $category_id = -1;

    //admins can only use admin-made categories but users can
    //use both admin and their own categories.
    //If there are duplicate category names, we'll prioritize a user's category first.
    
    if($userID > 0) {
        $query = "SELECT category_id FROM category_translation WHERE language = 'def' AND text = '" . 
                $category_name . "' AND owner = " . $userID . ";";    
        $result = $conn->query($query);
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $category_id = $row["category_id"];
        }
    }
    if($category_id == -1) {
        $query = "SELECT category_id FROM category_translation WHERE language = '" . $language . "' AND text = '" . 
                    $category_name . "' AND owner = 0;";
        $result = $conn->query($query);
    
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $category_id = $row["category_id"];
        }
    }

    if($category_id == -1) {
        $message = '{"status":"category does not exist."}';
        echo $message;
        return;
    }

    //now we have a category id to assign the tag to.
    //check if there are any name conflicts with this tag.

    $duplicate_tag = FALSE;
    $lang_len = count(supported_languages); //# of supported languages

    if($userID == 0) { //Admin tag

        //admins can't have any overlap for each of the supported languages
        $query = "SELECT * FROM tags_translation WHERE ";
        for($idx = 0; $idx < $lang_len; $idx++) {
            if($idx > 0) $query = $query . " OR ";
            $cur_lang = supported_languages[$idx];
            $query = $query . "(text = '" . $inData[$cur_lang] . "' AND language = '" . 
		        $cur_lang . "' AND owner = 0 AND tag_id != " . $edit_tag . ")";
        }
        $query = $query . ";";

        $result = $conn->query($query);
        if($result->num_rows > 0) {
            $duplicate_tag = TRUE;
        }
    }
    else { //User tag
        $tag_name = $inData["def"];

        //users cant have overlap with any of their own tags
        $query = "SELECT * FROM tags_translation WHERE text = '" . $tag_name . "' AND owner = " . $userID . " AND tag_id != " . $edit_tag . ";";
        $result = $conn->query($query);

        if($result->num_rows > 0) {
            $duplicate_tag = TRUE;
        }
    }

    if($duplicate_tag == TRUE) {
        echo '{"status":"duplicate tag name."}';
        return;
    }

    if($edit_tag == -1) { //okay inserting a tag
        //now insert the tag 
        $query = "INSERT INTO tags (owner_id, category_id) VALUES (" . $userID . ", " . $category_id . ");";
        $result = $conn->query($query);
        $tag_id = $conn->insert_id;
    
        //now insert all translations of the tag
        if($userID == 0) { //Admin inserts all translations
            $query = "INSERT INTO tags_translation (tag_id, language, text, owner) VALUES ";
            for($idx = 0; $idx < $lang_len; $idx++) {
                if($idx > 0) $query = $query . ", ";
                $cur_lang = supported_languages[$idx];
                $add_to_query = "(" . $tag_id . ", '" . $cur_lang . "', '" . $inData[$cur_lang] . "', " . $userID . ")";
                $query = $query . $add_to_query;
            }
            $query = $query . ";";
        }
        else { //User inserts just one entry whose langauge is "def".
            $query = "INSERT INTO tags_translation (tag_id, language, text, owner) VALUES 
            (" . $tag_id . ", 'def', '" . $inData["def"] . "', " . $userID . ");";
        }
    
        $result = $conn->query($query);
        if(!$result) {
            $message = '{"status":"' . $conn->error . '"}';
            echo $message;
            return;
        }
        
        $message = '{"status":"Successfully added tag"}';
        echo $message;
    }
    else { //okay editing a tag

        if($userID == 0) {
            for($idx = 0; $idx < $lang_len; $idx++) {
                $cur_lang = supported_languages[$idx];
                $query = "UPDATE tags_translation SET text = '" . $inData[$cur_lang] . "' WHERE tag_id = " . 
                    $edit_tag . " AND language = '" . $cur_lang . "';";
                
                $conn->query($query);
                if(!$result) {
                    $message = '{"status":"' . $conn->error . '"}';
                    echo $message;
                    return;
                }
            }
        }
        else {
            $query = "UPDATE tags_translation SET text = '" . $inData["def"] . "' WHERE tag_id = " . $edit_tag . ";";
            $conn->query($query);
            if(!$result) {
                $message = '{"status":"' . $conn->error . '"}';
                echo $message;
                return;
            }
        }
        $message = '{"status":"Successfully updated tag"}';
        echo $message; 

    }


?>