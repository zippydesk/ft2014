<?php
class User
{
    // property declaration
    public $signedIn = false;
    public $ID;
    public $name;
    public $screen_name;
    public $picture;
    private $access_token;
    private $db;

    public function __construct($db) {
    	$this->db = $db;
    }

    public function setTwitterUser($content, $access_token) {
    	$this->ID = $content['id'];
    	$this->name = $content['name'];
    	$this->screen_name = $content['screen_name'];
    	$this->picture = $content['profile_image_url'];
    	$this->access_token = $access_token;
    }

    public function isSignedIn() {
    	if (!empty ($_SESSION['status']) && $_SESSION['status'] === 'verified') {
    		return true;
    	}
    	return false;
    }
}
?>