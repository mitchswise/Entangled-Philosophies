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
    $edit_category = $inData["edit_category"];

    //check for duplicate categories
    $duplicate_cat = FALSE;
    $lang_len = count(supported_languages); //# of supported languages

    if($userID == 0) {
        $query = "SELECT * FROM category_translation WHERE ";
        for($idx = 0; $idx < $lang_len; $idx++) {
            if($idx > 0) $query = $query . " OR ";
            $cur_lang = supported_languages[$idx];
            $query = $query . "(text = '" . $inData[$cur_lang] . "' AND language = '" . 
		        $cur_lang . "' AND owner = 0 AND category_id != " . $edit_category . ")";
        }
        $query = $query . ";";

        $result = $conn->query($query);
        if($result->num_rows > 0) {
            $duplicate_cat = TRUE;
        }
    }
    else {
        $query = "SELECT * FROM category_translation WHERE text = '" . $inData["def"] . "' AND owner = " . $userID . ";";
        $result = $conn->query($query);
        if($result->num_rows > 0) {
            $duplicate_cat = true;
        }
    }
    
    if($duplicate_cat == TRUE) {
        echo '{"status":"duplicate category name."}';
        return;
    }

    if($edit_category == -1) { //okay inserting a category
        $query = "INSERT INTO category (owner) VALUES (" . $userID . ");";
        $result = $conn->query($query);
        $category_id = $conn->insert_id;
    
        //now insert all translations of the category
        if($userID == 0) { //Admin inserts all translations
            $query = "INSERT INTO category_translation (category_id, language, text, owner) VALUES ";
            for($idx = 0; $idx < $lang_len; $idx++) {
                if($idx > 0) $query = $query . ", ";
                $cur_lang = supported_languages[$idx];
                $add_to_query = "(" . $category_id . ", '" . $cur_lang . "', '" . $inData[$cur_lang] . "', " . $userID . ")";
                $query = $query . $add_to_query;
            }
            $query = $query . ";";
        }
        else { //User inserts just one entry whose langauge is "def".
            $query = "INSERT INTO category_translation (category_id, language, text, owner) VALUES 
            (" . $category_id . ", 'def', '" . $inData["def"] . "', " . $userID . ");";
        }
    
        $result = $conn->query($query);
        if(!$result) {
            $message = '{"status":"' . $conn->error . '"}';
            echo $message;
            return;
        }
        
        $message = '{"status":"Successfully added category"}';
        echo $message;
    }
    else { //okay editing a category

        if($userID == 0) {
            for($idx = 0; $idx < $lang_len; $idx++) {
                $cur_lang = supported_languages[$idx];
                $query = "UPDATE category_translation SET text = '" . $inData[$cur_lang] . "' WHERE category_id = " . 
                    $edit_category . " AND language = '" . $cur_lang . "';";
                
                $conn->query($query);
                if(!$result) {
                    $message = '{"status":"' . $conn->error . '"}';
                    echo $message;
                    return;
                }
            }
        }
        else {
            $query = "UPDATE tags_translation SET text = '" . $inData["def"] . "' WHERE tag_id = " . $edit_category . ";";
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