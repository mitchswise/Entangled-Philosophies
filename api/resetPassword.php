<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	require './vendor/autoload.php';
	include 'database.php';

	$conn = new mysqli($host, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);

	//validate the username/email provided
	$sql = "SELECT email, username, id FROM users WHERE username = '" . addslashes($inData["username"]) . "' AND email = '" . addslashes($inData["email"]) . "';";
	$result = $conn->query($sql);

	
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		
		//change the password
		$new_pass = generatePassword(15);
		$sql = "UPDATE users SET password = '" . password_hash($new_pass, PASSWORD_DEFAULT) . "' WHERE id = " . $row["id"] . ";";
		$result = $conn->query($sql);

		$mail = new PHPMailer(TRUE);
		try {
			$mail->setFrom('regularspam34627@gmail.com', 'Entangled Philosophy');
			$mail->addAddress($row["email"], $inData["username"]);
			$mail->Subject = 'Password reset for ' . $inData["username"];
			$message = 'Your new password is: ' . $new_pass;
			$mail->Body = $message;
			
			$mail->isSMTP();
			$mail->Host = 'smtp.gmail.com';
			$mail->SMTPAuth = TRUE;
			$mail->SMTPSecure = 'tls';
			$mail->Username = 'regularspam34627@gmail.com';
			$mail->Password = 'TestPass123!';
			$mail->Port = 587;
			
			$mail->send();
			echo '{"status":"successfully reset password"}';
		}
		catch (Exception $e) {
			echo '{"status":"' . $e->errorMessage() . '"}';
		}
		catch (\Exception $e) {
			echo '{"status":"' . $e->getMessage() . '"}';
		}

	} else {
		echo '{"status":"username/email does not exist"}';
	}

	function generatePassword( $pass_length ) {
		$letters = "abcdefghijklmnopqrstuvwxyz";
		$letters = $letters . "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$letters = $letters . "0123456789";
		$letter_len = strlen($letters);

		$password = '';
		for($index = 0; $index < $pass_length; $index++) {
			$character = $letters[ rand(0, $letter_len - 1) ];
			$password = $password . $character;
		}

		return $password;
	}
?>
