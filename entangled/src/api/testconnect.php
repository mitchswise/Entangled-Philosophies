<?php

header("Access-Control-Allow-Headers: Content-type");
header("Access-Control-Allow-Origin: *");

$host = "chdr.cs.ucf.edu";
$user = "entangled_philosophy";
$password = "GjOIYa1O1OpwQR8X";
$dbname = "entangled_philosophy";
$id = "";

$conn = mysqli_connect($host, $user, $password, $dbname);
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