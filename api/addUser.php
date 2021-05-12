<?php
header("Access-Control-Allow-Origin: *");
header("Vary: Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Expose-Headers: application/json");
include "database.php";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$inData = json_decode(file_get_contents('php://input'), true);
$sql = 'INSERT INTO users (username, email, password) VALUES ("' .
	$inData["username"] . '", "' . $inData["email"] . '", "' . $inData["password"] . '")';
$result = $conn->query($sql);

if ($result) {
	echo '{"status":"success"}';
} else {
	echo '{"status":"error"}'; 	
} 
?>
