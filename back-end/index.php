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

// Crea una nueva instancia de SLIM 
$app = new \Slim\App($contenedor);

// Definimos nuestras rutas


/*RUTAS DE USUARIO*/

/*user/login->logear el usuario*/
$app->post(
    '/user/login',
    function ($request, $response) {
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

/*user/logout->deslogear el usuario*/
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

/*user/registerUser->registar una cuent usuario*/
$app->post(
    '/user/registerUser',
    function ($request, $response) {
        /** @var Request $request */
        /** @var Response $response */
        $userController = new App\Controllers\UserController();
        $result = $userController->registerUser($request);
        return $response->withJson($result);
    }
);

/*user/editAccount->editar una cuent usuario*/
$app->post(
    '/user/editUser',
    function ($request, $response) {
        /** @var Request $request */
        /** @var Response $response */
        $userController = new App\Controllers\UserController();
        $result = $userController->editUser($request);
        return $response->withJson($result);
    }
);

/*user/deleteUser->Eliminar una cuent usuario*/
$app->delete(
    '/user/deleteUser/{userId}',
    function ($request, $response, $args) {
        /** @var Request $request */
        /** @var Response $response */
        $userController = new App\Controllers\UserController();
        $result = $userController->deleteUser($request, $args);
        return $response->withJson($result);
    }
);

/*
//user/getAllUsers
$app->get(
    '/user/getAllUsers',
    function($request, $response){
        // @var Request $request
        // @var Response $response
        $userController= new App\Controllers\UserController();
        $result= $userController->getAllUsers($request);
        return $response->withJson($result);
    }
);
*/



/*RUTAS DE TRANSACCIONES*/

//registerTransact
$app->post(
    '/transact/saveTransaction',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $transactionsController= new App\Controllers\TransactionsController();
        $result= $transactionsController->saveTransaction($request);
        return $response->withJson($result);
    }
);


//get transacts by userId // get all user transacts
$app->get(
    '/transact/getTransactByUserId/{userId}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $transactionsController= new App\Controllers\TransactionsController();
        $result= $transactionsController->getTransactByUserId($request);
        return $response->withJson($result);;
    }
);



//transactions/getReservedSeats 
$app->post(
    '/transactions/getReservedSeats',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $transactionsController= new App\Controllers\TransactionsController();
        $result= $transactionsController->getReservedSeats($request);
        return $response->withJson($result);
    }
);









//user/getUserById
$app->get(
    '/client/getClientById/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $clientController= new App\Controllers\ClientController();
        $result= $clientController->getClientById($request);
        return $response->withJson($result);
    }
);




//getEventById
$app->get(
    '/events/getEventById/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->getEventById($request);
        return $response->withJson($result);
    }
);











// Corremos la aplicación.
$app->run();

