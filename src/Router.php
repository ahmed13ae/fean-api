<?php

namespace App;

class Router
{
    private array $routes = [];

    public function get(string $url, callable $handler): void
    {
        $this->addRoute("GET", $url, $handler);
    }

    public function post(string $url, callable $handler): void
    {
        $this->addRoute("POST", $url, $handler);
    }

    public function patch(string $url, callable $handler): void
    {
        $this->addRoute("PATCH", $url, $handler);
    }

    public function delete(string $url, callable $handler): void
    {
        $this->addRoute("DELETE", $url, $handler);
    }

    private function addRoute(string $method, string $url, callable $handler): void
    {
        $this->routes[$method][$url] = $handler;
    }

    public function dispatch(string $method, string $path): void
    {
        foreach ($this->routes[$method] ?? [] as $route => $handler) {
            if ($this->match($route, $path, $params)) {
                call_user_func_array($handler, $params);
                return;
            }
        }

        http_response_code(404);
        echo json_encode(["message" => "Route not found"]);
    }

    private function match(string $route, string $path, &$params): bool
    {
        $routePattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[a-zA-Z0-9_-]+)', $route);
        $routePattern = "#^" . $routePattern . "$#";

        if (preg_match($routePattern, $path, $matches)) {
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            return true;
        }

        return false;
    }
}
