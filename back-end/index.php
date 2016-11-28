<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

/**
 * index.php
 * Inicia la aplicación y sirve como enrutador para el back-end.
 */

require "bootstrap.php";

use Slim\Http\Request;
use Slim\Http\Response;

// Muestra todos los errores
$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];

$contenedor = new \Slim\Container($configuration);

// Crea una nueva instancia de SLIM mostrando todos los errores
// http://www.slimframework.com/docs/handlers/error.html
$app = new \Slim\App($contenedor);

// Definimos nuestras rutas
$app->post(
    '/user/login',
    function ($request, $response) {
        // http://stackoverflow.com/questions/12158987/whats-the-meaning-of-var-in-php-comments
        /** @var Request $request */
        /** @var Response $response */

        // Pedimos una instancia del controlador del usuario
        $userController = new App\Controllers\UserController();

        // Almacenamos el resultado de la operación en la siguiente variable
        $result = $userController->login($request);

        // Retornamos un JSON con el resultado al Front-End
        return $response->withJson($result);
    }
);

$app->get(
    '/user/logout',
    function ($request, $response) {
        /** @var Request $request */
        /** @var Response $response */
        $userController = new App\Controllers\UserController();
        $result = $userController->logout($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/user/register',
    function ($request, $response) {
        /** @var Request $request */
        /** @var Response $response */
        $userController = new App\Controllers\UserController();
        $result = $userController->register($request);
        return $response->withJson($result);
    }
);

// Corremos la aplicación.
$app->run();
