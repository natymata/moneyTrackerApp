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


/*user/getAllUsers*/
$app->get(
    '/user/getAllUsers',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $userController= new App\Controllers\UserController();
        $result= $userController->getAllUsers($request);
        return $response->withJson($result);
    }
);



/*RUTAS DE CLIENTE*/
///client/validateClientInfo-> validar los datos del cliente
$app->post(
    '/client/validateClientInfo',
    function ($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $clientController = new App\Controllers\ClientController();
        $result = $clientController->validateClientInfo($request);
        return $response->withJson($result);
    }
);

///client/registerClient->registrar los datos del cliente en la tabla cliente.
$app->post(
    '/client/registerClient/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $clientController= new App\Controllers\ClientController();
        $result= $clientController->registerClient($request);
        return $response->withJson($result);
    }
);


//getClientEvents
$app->get(
    '/client/getClientEvents/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $clientController= new App\Controllers\ClientController();
        $result= $clientController->getClientEvents($request);
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

/*RUTAS DE CAJERO*/
//cashier/validateCahierInfo
$app->post(
    '/cashier/validateCahierInfo',
    function ($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $cashierController = new App\Controllers\CashierController();
        $result = $cashierController->validateCahierInfo($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/cashier/registerCashier/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $cashierController= new App\Controllers\CashierController();
        $result= $cashierController->registerCashier($request);
        return $response->withJson($result);
    }
);



/*RUTAS DE PROMOTOR*/
//promoter/registerRequest
$app->post(
    '/promoter/registerRequest',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $promoterController= new App\Controllers\PromoterController();
        $result= $promoterController->registerRequest($request);
        return $response->withJson($result);
    }
);

//registerRequestById
$app->get(
    '/promoter/getRegisterRequestById/{id}',
    function($request, $response){
         /** @var Request $request */
        /** @var Response $response */
        $promoterController= new App\Controllers\PromoterController();
        $result= $promoterController->getRegisterRequestById($request);
        return $response->withJson($result);
    }
);


$app->get(
    '/promoter/getPromoterById/{id}',
    function($request, $response){
         /** @var Request $request */
        /** @var Response $response */
        $promoterController= new App\Controllers\PromoterController();
        $result= $promoterController->getPromoterById($request);
        return $response->withJson($result);
    }
);

//promoter/getAllRequest
$app->get(
    '/promoter/getAllRequest',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $promoterController= new App\Controllers\PromoterController();
        $result= $promoterController->getAllRequest($request);
        return $response->withJson($result);
    }
);


/*RUTAS DE EVENTOS*/
$app->get(
    '/events/getAllEventTypes',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->getAllEventTypes($request);
        return $response->withJson($result);
    }
);


//registerEvent
$app->post(
    '/event/registerEvent',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->registerEvent($request);
        return $response->withJson($result);
    }
);


//getTodayEvents
$app->get(
    '/events/getTodayEvents',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->getTodayEvents($request);
        return $response->withJson($result);
    }
);


//events/getAllActiveEvents
$app->get(
    '/events/getAllActiveEvents',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->getAllActiveEvents($request);
        return $response->withJson($result);
    }
);


//getEventsByCategory/' + eventType;
$app->get(
    '/events/getEventsByCategory/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->getEventsByCategory($request);
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

//getEventTypeById
$app->get(
    '/events/getEventTypeById/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $eventsController= new App\Controllers\EventsController();
        $result= $eventsController->getEventTypeById($request);
        return $response->withJson($result);
    }
);



/*RUTAS DE SITIOS*/
$app->get(
    '/sites/getSiteList',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $sitesController= new App\Controllers\SitesController();
        $result= $sitesController->getSiteList($request);
        return $response->withJson($result);
    }
);

//site/registerSite
$app->post(
    '/sites/registerSite',
    function ($request, $response) {
        /** @var Request $request */
        /** @var Response $response */
        $sitesController= new App\Controllers\SitesController();
        $result= $sitesController->registerSite($request);
        return $response->withJson($result);
    }
);


$app->get(
    '/sites/getSiteById/{id}',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $sitesController= new App\Controllers\SitesController();
        $result= $sitesController->getSiteById($request);
        return $response->withJson($result);
    }
);


//RUTAS DE TRANSCCIONES
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

$app->post(
    '/transactions/saveTransaction',
    function($request, $response){
        /** @var Request $request */
        /** @var Response $response */
        $transactionsController= new App\Controllers\TransactionsController();
        $result= $transactionsController->saveTransaction($request);
        return $response->withJson($result);
    }
);








// Corremos la aplicación.
$app->run();

