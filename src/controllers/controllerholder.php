<?php

// namespace App\Controllers;

// class CourseController
// {
//     public function __construct(private CourseGateway $gateway) {}
//     public function processRequest(string $method, ?string $id): void
//     {
//         //without id
//         if ($id === null) {

//             if ($method == "GET") {

//                 echo json_encode($this->gateway->getAll());
//             } elseif ($method == "POST") {
//                 $body = (array) json_decode(file_get_contents("php://input"), true);
//                 $errors = $this->getValidationErrors($body);

//                 if (! empty($errors)) {

//                     $this->respondUnprocessableEntity($errors);
//                     return;
//                 }
//                 $id = $this->gateway->create($body);
//                 $this->respondCreated($id);
//             } else {

//                 $this->respondMethodNotAllowed("GET, POST");
//             }
//         } else {
//             $course = $this->gateway->get($id);
//             if ($course === false) {
//                 $this->respondNotFound($id);
//                 return;
//             }

//             switch ($method) {

//                 case "GET":
//                     echo json_encode($course);
//                     break;

//                 case "PATCH":
//                     $body = (array) json_decode(file_get_contents("php://input"), true);
//                     $errors = $this->getValidationErrors($body);

//                     if (! empty($errors)) {

//                         $this->respondUnprocessableEntity($errors);
//                         return;
//                     }
//                     $updatedRowsCount=$this->gateway->update($id,$body);
//                     echo json_encode(['message'=>"$updatedRowsCount has been updated"]);
//                     break;

//                 case "DELETE":
//                     $deletesRowCount=$this->gateway->delete($id);
//                     echo json_encode(['message'=>"$deletesRowCount has been deleted"]);
//                     break;

//                 default:
//                     $this->respondMethodNotAllowed("GET, PATCH, DELETE");
//             }
//         }
//     }
//     //allowed methods header
//     private function respondMethodNotAllowed(string $allowed_methods): void
//     {
//         http_response_code(405);
//         header("Allow: $allowed_methods");
//     }
//     //the respond not found 404
//     private function respondNotFound(string $id): void
//     {
//         http_response_code(404);
//         echo json_encode(["message" => "course with this $id id isn't found"]);
//     }
//     //created successfully
//     private function respondCreated(string $id): void
//     {
//         http_response_code(201);
//         echo json_encode(["message" => "course created", "id" => $id]);
//     }
//     //respond for error with the body
//     private function respondUnprocessableEntity(array $errors): void
//     {
//         http_response_code(422);
//         echo json_encode(["errors" => $errors]);
//     }
//     //validation errors
//     private function getValidationErrors(array $body, bool $is_new = true): array
//     {
//         $errors = [];

//         if ($is_new && empty($body["name"])) {

//             $errors[] = "name is required";
//         }

//         if (! empty($body["price"])) {

//             if (filter_var($body["price"], FILTER_VALIDATE_FLOAT) === false) {

//                 $errors[] = "price must be a number";
//             }
//         }

//         return $errors;
//     }
// }
