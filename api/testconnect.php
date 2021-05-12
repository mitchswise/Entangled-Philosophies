<?php

header("Access-Control-Allow-Headers: Content-type");
header("Access-Control-Allow-Origin: *");

include "database.php";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if($conn->connect_error) {
	die("Connection failed " . $conn->connect_error);
}

$query = "SELECT * FROM papers;";
$result = mysqli_query($conn, $query);

if(!$result) {
    // http_response_code(404);
	die(mysqli_error($conn));
}

$ret_value = '{"NumRows": ' . $result->num_rows . '}';

echo $ret_value;

?>
