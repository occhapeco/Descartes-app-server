<?php
require_once('lib/nusoap.php');
$server = new soap_server;

function hello($name) {
    return 'Hello, ' . $name;
}

function retrieveByType($type) {
	$json[0] = '{"email" : "oie@oie" , "senha" : "oie" }';
	return $json;
}

$server->register('hello');
$server->register('retrieveByType');

$HTTP_RAW_POST_DATA = isset($HTTP_RAW_POST_DATA) ? $HTTP_RAW_POST_DATA : '';
$server->service($HTTP_RAW_POST_DATA);
?>