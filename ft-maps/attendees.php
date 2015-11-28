<?php 
	$dbh = new PDO('mysql:host=localhost;dbname=fr0nt510_ftmap', 'fr0nt510_ftmap51', 'Qoyy780iQqBCDstzO');
	$stmt = $dbh->query('SELECT * FROM attendees');
    $attendees = array();
    foreach($stmt as $row) {
          $attendees[] = $row;
    }
    $stmt->closeCursor();
    header('Content-Type: text/html; charset=utf-8');
    echo json_encode($attendees);
    $dbh = null;
    die();

