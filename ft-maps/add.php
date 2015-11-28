<?php
    error_reporting(E_ALL);
    session_start();
    require_once('twitteroauth/twitteroauth.php');
    require_once('config.php');
    include('user.php');
    $dbh = new PDO('mysql:host=localhost;dbname=fr0nt510_ftmap', 'fr0nt510_ftmap51', 'Qoyy780iQqBCDstzO');
    $user = new User($dbh);

    /* Get user access tokens out of the session. */
    if (!empty ($_SESSION['access_token'])) {
        $access_token = $_SESSION['access_token'];
    } else {
        die();
        exit();
    }

    if (!empty ($access_token) && !empty($_SESSION['twitterUser']) && $_SESSION['status'] == 'verified') {
        $user->setTwitterUser($_SESSION['twitterUser'], $access_token);
        if (!empty($_POST['reason']) && !empty($_POST['longitude']) && !empty($_POST['latitude'])) {
            $dbh -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $lat = $_POST['latitude'];
            $long = $_POST['longitude'];
            if (!preg_match("/([0-9.-]+).+?([0-9.-]+)/i", $lat)) {
                die();
            }
            if (!preg_match("/([0-9.-]+).+?([0-9.-]+)/i", $long)) {
                die();
            }
            $stmt = $dbh -> prepare('INSERT INTO `attendees` (`ID`, `screen_name`, `name`, `picture`, `why`, `lat`, `long`, `added`) VALUES (:ID, :screen_name, :name,:picture,:why,:lat,:long, UTC_TIMESTAMP())');


            $stmt -> bindValue(':ID', (int)$user->ID, PDO::PARAM_INT); // 2
            $stmt -> bindValue(':screen_name', $user->screen_name, PDO::PARAM_STR); // 2
            $stmt -> bindValue(':name', $user->name, PDO::PARAM_STR);
            $stmt -> bindValue(':picture', $user->picture, PDO::PARAM_STR);
            $stmt -> bindValue(':why', $_POST['reason'], PDO::PARAM_STR);
            $stmt -> bindValue(':long', $lat, PDO::PARAM_STR);
            $stmt -> bindValue(':lat', $long, PDO::PARAM_STR);
            try {
                $addedItemsLength = $stmt -> execute(); // 3
                if($addedItemsLength > 0) {
                    echo "OK";
                    die();
                } 
            } catch (Exception $ex) {
                echo "INVALID";
                die();
            }
        }
    }
    
?>