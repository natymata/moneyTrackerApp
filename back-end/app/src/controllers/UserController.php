<?php


namespace App\Controllers;

use App\Services\LoggingService;
use App\Services\UserService;
use Slim\Http\Request;

class UserController {

    private $userService;
    private $ntLoginCookie = "loggedIn";

    /**
     * UserController constructor.
     */
    public function __construct() {
        $this->userService = new UserService();
    }

    /**
     *User login
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
            setcookie($this->ntLoginCookie, true, time()+3600);
            $result["user"] = $loginResult["user"];
            $result["message"] = $loginResult["message"]; 
            $result["canLogin"] = $loginResult["canLogin"]; 
        }

        return $result;
    } //end -login-


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
        if (array_key_exists($this->ntLoginCookie, $_COOKIE)) {
            $result["message"] = "User was logged out";
            $result["error"] = false;
            // Expirar el cookie en caso de que existiera
            setcookie($this->ntLoginCookie, true, time()-10);
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



       /**
     * Edita una cuenta de un usuario.
     *
     * @param Request $request
     *
     * @return string []
     */

    public function editUser($request) {
        $result = [];
        $formData = $request->getParsedBody();

        $userId= null;
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

        $editResult = $this->userService->editUser($userId, $name, $lastName, $username, $money, $accountType, $pass, $repeatPass);

        if(array_key_exists("error", $editResult)) {
            $result["error"] = true;
            $result["message"] = $editResult["message"];
            $result["edited"] = false;
        }else{
            $result["message"] = $editResult["message"];
            $result["edited"] = true;
            $result["error"] = false;
        }
        return $result;
    } //end -editUser-


    /**
    * Delete an user account
    * @param  $request 
    * @param  $args    
    * @return []         
    */
    public function deleteUser($request, $args){
        $result = [];
        $userId = $args['userId'];
        LoggingService::logVariable($userId, __FILE__, __LINE__);

        $deleteResult = $this->userService->deleteUser($userId);

        if (array_key_exists("error", $deleteResult)) {
            $result["error"] = true;
            $result["message"]= $deleteResult["message"];
            $result["deleted"] = false;
        }else{
            $result["message"] = $deleteResult["message"];
            $result["error"]= false;
            $result["deleted"] = true;
        }
        return $result;
    }//end  delete user.



/*
    public function getAllUsers(){
        return $this->userService->getAllUsers();
    }
*/
    


} // end -class-