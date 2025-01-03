<?php

require __DIR__. '/bootstrap.php';


use App\Controllers\AuthController;
use App\Controllers\CourseController;
use App\Database;
use App\Router;



// //database 
 $database=new Database($_ENV['DB_HOST'],$_ENV['DB_DATABASE'],$_ENV['DB_USERNAME'],$_ENV['DB_PASSWORD']);
$database->getConnection();

//initiate controllers
$courseController=new CourseController($database);
$authController=new AuthController($database);
//router----------------
$router=new Router();
//routes--------------------
//courses routes--
$router->get('/courses',[$courseController, 'getAll']);
$router->get('/courses/{id}',[$courseController, 'get']);
$router->post('/courses',[$courseController, 'create']);
$router->patch('/courses/{id}',[$courseController, 'update']);
$router->delete('/courses/{id}',[$courseController, 'delete']);
//auth routes--
$router->post('/users/signup',[$authController,'signUp']);
//despatching the routes
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$basePath = '/fean/api';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}
$path = '/' . ltrim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];
$router->dispatch($method, $path);

