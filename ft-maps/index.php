<?php
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');
include('user.php');
$dbh = new PDO('mysql:host=localhost;dbname=fr0nt510_ftmap', 'fr0nt510_ftmap51', 'Qoyy780iQqBCDstzO');
$user = new User($dbh);

/* If access tokens are not available redirect to connect page. */
if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret'])) {
    //header('Location: ./signin.php');
    //exit();
}

/* Get user access tokens out of the session. */
if (!empty ($_SESSION['access_token'])) {
	$access_token = $_SESSION['access_token'];
}
if (!empty ($access_token) && !empty ($_SESSION['twitterUser'])) {
	$user->setTwitterUser($_SESSION['twitterUser'], $access_token);
}


header('Content-Type: text/html; charset=utf-8');
include('index.html');

?>