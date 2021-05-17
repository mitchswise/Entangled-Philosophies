<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	require '/home/blaze/Documents/GitHub/Entangled-Philosophies/api/vendor/autoload.php';
	include 'database.php';	

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);
	$sql = "SELECT activation_code email FROM users WHERE username = '" . $inData["username"] . "';";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$mail = new PHPMailer(TRUE);
		try {
			$mail->setFrom('regularspam34627@gmail.com', 'Entangled Philosophy');
			$mail->addAddress($row["email"], $inData["username"]);
			$mail->Subject = 'Activation code for ' . $inData["username"];
			$mail->Body = 'Your activation code: ' . $row["activate_code"];
			
			$mail->isSMTP();
			$mail->Host = 'smtp.gmail.com';
			$mail->SMTPAuth = TRUE;
			$mail->SMTPSecure = 'tls';
			$mail->Username = 'regularspam34627@gmail.com';
			$mail->Password = 'TestPass123!';
			$mail->Port = 587;
			
			$mail->send();
			echo '{"status":"success"}';
		}
		catch (Exception $e) {
			echo $e->errorMessage();
		}
		catch (\Exception $e) {
			echo $e->getMessage();
		}

	} else {
		echo '{"status":"username does not exist"}';
	}
?>
