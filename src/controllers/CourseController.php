<?php

namespace App\Controllers;

use App\Database;
use PDO;

class CourseController
{
    private PDO $conn;
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }
    //get all courses---------------------------
    public function getAll(): void
    {
        $sql = "SELECT * FROM courses ORDER BY name";
        $stmt = $this->conn->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
    //get a course by id-------------------------
    public function get(string $id): void
    {
        $sql = "SELECT * FROM courses WHERE id=:id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
    //create course --------------------------------------------------------
    public function create(): void
    {
        $body = (array) json_decode(file_get_contents("php://input"), true);
        $errors = $this->getValidationErrors($body);

        if (!empty($errors)) {
            $this->respondUnprocessableEntity($errors);
            return;
        }
        $sql = "INSERT INTO courses (name, price)
                VALUES (:name, :price)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":name", $body['name'], PDO::PARAM_STR);
        $stmt->bindValue(":price", $body['price'], PDO::PARAM_STR);
        $stmt->execute();

        // Return the last inserted ID
        $id = $this->conn->lastInsertId();
        $this->respondCreated($id);
    }
    //update course- --- - - - - - - -- - - - - 
    public function update(string $id): void
    {
        $body = (array) json_decode(file_get_contents("php://input"), true);
        $errors = $this->getValidationErrors($body);

        if (! empty($errors)) {

            $this->respondUnprocessableEntity($errors);
            return;
        }
        $fields = [];
        if (!empty($body['name'])) {
            $fields['name'] = [$body['name'], PDO::PARAM_STR];
        }
        if (!empty($body['price'])) {
            $fields['price'] = [$body['price'], PDO::PARAM_STR];
        }
        if (empty($fields)) {
        } else {
            //use the fields to create the sql query
            $sets = array_map(function ($value) {
                return "$value= :$value";
            }, array_keys($fields));
            $sql = "UPDATE courses SET " . implode(",", $sets) . " WHERE id=:id";
            $stmt=$this->conn->prepare($sql);
            $stmt->bindValue(":id",$id,PDO::PARAM_INT);
            foreach($fields as $key=>$value){
                $stmt->bindValue(":$key",$value[0],$value[1]);
            }
            $stmt->execute();
            $updatedRowsCount= $stmt->rowCount();
            echo json_encode(['message'=>"$updatedRowsCount has been updated"]);

        }

    }
    //delete course-------------
    public function delete(string $id): void
    {
        $sql = "DELETE FROM courses
                WHERE id = :id";
                
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        
        $stmt->execute();
        
        $deletedRows=$stmt->rowCount();
        echo json_encode(["message" => "{$deletedRows} Courses deleted"]);
    }
    //allowed methods header
    private function respondMethodNotAllowed(string $allowed_methods): void
    {
        http_response_code(405);
        header("Allow: $allowed_methods");
    }
    //the respond not found 404
    private function respondNotFound(string $id): void
    {
        http_response_code(404);
        echo json_encode(["message" => "course with this $id id isn't found"]);
    }
    //created successfully
    private function respondCreated(string $id): void
    {
        http_response_code(201);
        echo json_encode(["message" => "course created", "id" => $id]);
    }
    //respond for error with the body
    private function respondUnprocessableEntity(array $errors): void
    {
        http_response_code(422);
        echo json_encode(["errors" => $errors]);
    }
    //validation errors
    private function getValidationErrors(array $body, bool $is_new = true): array
    {
        $errors = [];

        if ($is_new && empty($body["name"])) {

            $errors[] = "name is required";
        }

        if (! empty($body["price"])) {

            if (filter_var($body["price"], FILTER_VALIDATE_FLOAT) === false) {

                $errors[] = "price must be a number";
            }
        }

        return $errors;
    }
}
