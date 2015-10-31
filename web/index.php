<?php 

$token = "a9TGmTDMitaAKCmWr83nzqnT";
if($token !== $_REQUEST['token'])
	exit();

$user = $_REQUEST['user_name'];
$triggerWord = $_REQUEST['trigger_word'];
$text = trim(preg_replace("/".$triggerWord."/", "", $_REQUEST["text"], 1));
$response["text"] =$user. " sa " . $text;

exit(json_encode($response));
?>
