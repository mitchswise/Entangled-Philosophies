<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	require './vendor/autoload.php';
	include 'database.php';

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	$inData = json_decode(file_get_contents('php://input'), true);
	$sql = "SELECT activation_code, email, id FROM users WHERE username = '" . addslashes($inData["username"]) . "';";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$mail = new PHPMailer(TRUE);
		try {
			$mail->setFrom('regularspam34627@gmail.com', 'Entangled Philosophy');
			$mail->addAddress($row["email"], $inData["username"]);
			$mail->Subject = 'Activation code for ' . $inData["username"];
			$URL = 'http://chdr.cs.ucf.edu/~entangledPhilosophy/Entangled-Philosophies/api/verify.php?code=' . $row["activation_code"] . '&id=' . $row["id"];
			$mail->Body = $URL;
			
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
			echo '{"status":"' . $e->errorMessage() . '"}';
		}
		catch (\Exception $e) {
			echo '{"status":"' . $e->getMessage() . '"}';
		}

	} else {
		echo '{"status":"username does not exist"}';
	}
?>
