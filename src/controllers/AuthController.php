<?php
namespace App\Controllers;

use App\Database;
use PDO;
class AuthController{
    private PDO $conn;
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }
    //sign up-------------------------------
    public function signUp(){
        $body = (array) json_decode(file_get_contents("php://input"), true);
        $errors = $this->getValidationErrors($body);
        if (!empty($errors)) {
            $this->respondUnprocessableEntity($errors);
            return;
        }
        $sql = "INSERT INTO users (username, password)
        VALUES (:username,:password)";
        $stmt = $this->conn->prepare($sql);
        $password_hash = password_hash($body["password"], PASSWORD_DEFAULT);
        $stmt->bindValue(":username", $body["username"], PDO::PARAM_STR);
        $stmt->bindValue(":password", $password_hash, PDO::PARAM_STR);
        $stmt->execute();
        $response = [
            "status" => 'success',
            "message" => "User created successfully"
        ];
        echo json_encode($response);
    }
    //helper functions-----------
    private function getValidationErrors(array $body): array
    {
        $errors = [];

        // Check if username is provided
        if (empty($body["username"])) {
            $errors[] = "Username is required";
        }

        // Check if password is provided and meets the length requirement
        if (empty($body["password"])) {
            $errors[] = "Password is required";
        } elseif (strlen($body["password"]) < 6) {
            $errors[] = "Password must be at least 6 characters long";
        }

        return $errors;
    }
    private function respondUnprocessableEntity(array $errors): void
    {
        http_response_code(422);
        echo json_encode(["errors" => $errors]);
    }
}