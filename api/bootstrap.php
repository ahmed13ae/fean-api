<?php

require dirname(__DIR__) . '/vendor/autoload.php';

use Dotenv\Dotenv;

//modifying error handling behaviour 
set_error_handler("App\ErrorHandler::handleError");
//modifying the exception handling with our personal handler
set_exception_handler("App\ErrorHandler::handleException");


$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

header("Content-type: application/json; charset=UTF-8");