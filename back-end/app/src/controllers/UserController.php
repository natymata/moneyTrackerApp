<?php


namespace App\Controllers;

use App\Services\LoggingService;
use App\Services\UserService;
use Slim\Http\Request;

class UserController {

    private $userService;
    private $nombreCookie = "loggedIn";

    /**
     * UserController constructor.
     */
    public function __construct() {
        $this->userService = new UserService();
    }

    /**
     *
     * @param Request $request
     *
     * @return []
     */
    public function login($request) {
        $result = [];

        $formData = $request->getParsedBody();
        $username = null;
        $pass = null;

        // Verificar que exista una entrada de username
        if (array_key_exists("username", $formData)) {
            $username = $formData["username"];
        }

        // Verificamos que exista una entrada de pass
        if (array_key_exists("pass", $formData)) {
            $pass = $formData["pass"];
        }

        $loginResult = $this->userService->login($username, $pass);

        if (array_key_exists("error", $loginResult)) {
            $result["error"] = true;
            $result["message"] = $loginResult["message"];
        } else {
            /**
             *Crear un cookie en caso de que el usuario haya inicado sesión-
             */
            setcookie($this->nombreCookie, true, time()+3600);
            $result["user"] = $loginResult["user"];
            $result["message"] = $loginResult["message"]; 
            $result["canLogin"] = $loginResult["canLogin"]; 
        }

        return $result;
    } //end -login-


    public function getAllUsers(){
        return $this->userService->getAllUsers();
    }

    /**
     * Cierra la sesión del usuario del lado del back-end.
     *
     * @param Request $request
     *
     * @return string []
     */
    public function logout($request) {
        $result = [];

        // Verificamos si el usuario tenía un cookie en primer lugar
        if (array_key_exists($this->nombreCookie, $_COOKIE)) {
            $result["message"] = "User was logged out";
            // Expirar el cookie en caso de que existiera
            setcookie($this->nombreCookie, true, time()-10);
        } else {
            // Retornar un mensaje de error en caso de que se haya accedido al logout sin tener sesión activa
            $result["error"] = true;
            $result["message"] = "User never logged in";
        }

        return $result;
    } //end -logout-

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param Request $request
     *
     * @return string []
     */

    public function registerUser($request) {
        $result = [];
        $formData = $request->getParsedBody();

        $userId= null;
        $userType= null;
        $name= null;
        $lastName= null;
        $username= null;
        $money= null;
        $accountType= null;
        $pass= null;
        $repeatPass= null;

        LoggingService::logVariable($formData, __FILE__, __LINE__);

        if (array_key_exists("userId", $formData)) {
            $userId = $formData["userId"];
        }

        if (array_key_exists("userType", $formData)) {
            $userType = $formData["userType"];
        }

        if (array_key_exists("name", $formData)) {
            $name = $formData["name"];
        }

        if (array_key_exists("lastName", $formData)) {
            $lastName = $formData["lastName"];
        }

        if (array_key_exists("username", $formData)) {
            $username = $formData["username"];
        }

        if (array_key_exists("money", $formData)) {
            $money = $formData["money"];
        }

        if (array_key_exists("accountType", $formData)) {
            $accountType = $formData["accountType"];
        }

        if (array_key_exists("pass", $formData)) {
            $pass = $formData["pass"];
        }

        if (array_key_exists("repeatPass", $formData)) {
            $repeatPass = $formData["repeatPass"];
        }

        $registerResult = $this->userService->registerUser($userId, $userType, $name, $lastName, $username, $money, $accountType, $pass, $repeatPass);

        if(array_key_exists("error", $registerResult)) {
            $result["error"] = true;
            $result["message"] = $registerResult["message"];
            $result["created"] = false;
        }else{
            $result["meta"]= $registerResult["meta"]["id"];
            $result["message"] = $registerResult["message"];
            $result["created"] = true;
        }


        return $result;
    } //end -registerUser-

    


} // end -class-