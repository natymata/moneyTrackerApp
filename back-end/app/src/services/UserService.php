<?php

/**
 * UserService.php
 */

namespace App\Services;

class UserService {

    private $storage;
    private $validation;
    //private $isDBReady = true;

    /**
     * UserService constructor.
     */
    public function __construct() {
        $this->storage = new StorageService();
        $this->validation = new ValidationService();
    }


    /**
     * Encargado de iniciar la sesión del usuario.
     *
     * @param string $username
     * @param string $pass
     *
     * @return array
     */
    public function login($username, $pass) {
        $result = [];

        // Verificamos que el username sea válido
        if ($this->validation->isValidString($username)) {
            // Verificamos que el pass, sin espacios, tenga por lo menos 1 caracter
            if ($this->validation->isValidString($pass)) {
                // Si lo anterior tuvo éxito, se inicia el query.
                $query = "SELECT userId, name, lastName, username, password, money, accountType, tbUserType_idUserType FROM tbuser WHERE username = :username AND active=1 LIMIT 1";

                    //Parámetros del query
                    $params = [":username" => $username];

                $loginResult = $this->storage->query($query, $params);

                // Si la sentencia tiene por lo menos una fila, el usuario si existe.
                if (count($loginResult["data"]) > 0) {
                    // Almacenar el usuario en una variable
                    $user = $loginResult["data"][0];

                    // Verifcar el pass del usuario.
                    if (password_verify($pass, $user["password"])) {

                        // Definimos el mensaje de éxito
                        $result["message"] = "User found.";
                        $result["canLogin"] = true;

                        // Enviar de regreso los datos solicitados del usuario.
                        $result["user"] = [
                            "userId" => $user["userId"],
                            "name" => $user["name"],
                            "lastName" => $user["lastName"],
                            "username" => $user["username"],
                            "money" => $user["money"],
                            "accountType" => $user["accountType"],
                            "userType"=> $user["tbUserType_idUserType"]
                        ];
                    } else {
                        $result["message"] = "Invanlid password.";
                        $result["error"] = true;
                        $result["canLogin"] = false;
                    }
                } else {
                    // No encontramos un usuario con ese username y pass
                    $result["message"] = "Invalid credentials.";
                    $result["error"] = true;
                    $result["canLogin"] = false;
                }
            } else {
                // El pass está en blanco
                $result["message"] = "Password is required.";
                $result["error"] = true;
                $result["canLogin"] = false;
            }
        } else {
            // El username está en blanco
            $result["message"] = "Username is invalid.";
            $result["error"] = true;
            $result["canLogin"] = false;
        }

        return $result;
    } 


    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param string $firstname
     * @param string $secondname
     * @param string $firstlastname
     * @param string $secondlastname
     * @param int $personalId
     * @param string $email
     * @param string $password
     * @param string $repeatPass
     * @param int $userType

     * @return array
     */
    public function registerUser($userId, $userType, $name, $lastName, $username, $money, $accountType, $pass, $repeatPass){
        $result=[];

        $userId= trim($userId);
        $userType= trim($userType);
        $name= trim($name);
        $lastName= trim($lastName);
        $username= trim($username);
        $money= trim($money);
        $accountType= trim($accountType);
        $pass= trim($pass);
        $repeatPass= trim($repeatPass);

        // Verificar que efectivamente vengan todos los datos requeridos.
        if(isset($userId, $userType, $name, $lastName, $username, $money, $accountType, $pass, $repeatPass)){ //1
            //Verificar que el username sea uno disponible
            if($this->validation->isValidString($username) && $this->isUsernameAvailable($username)){//2
                //Verificar que el password y la confirmacion coincidan.
                if($pass == $repeatPass){//3
                    //verificar que el userId contenga al menos 9 caracteres
                    if($this->validation->isValidString($userId) && strlen(trim($userId))>=9){//5
                       //Verificar que el password se string válido y tenga al menos 6 caracteres.
                        if($this->validation->isValidString($pass) && strlen(trim($pass))>=6){//6
                            //Vefificar que la confirmacion de contraseña sea string válido.
                            if($this->validation->isValidString($repeatPass)){//7
                                //Verificar que el tipo de usuario este y sea un numero entre 1 y 2
                                if($this->validation->isValidInt($userType) && strlen(trim($userType))==1 && ($userType>=1 && $userType <=2)){//8
                                    //Verifwcar que el nombre sea valido
                                    if($this->validation->isValidString($name)){//9
                                        //verificar que el apellido sea un string válido
                                        if($this->validation->isValidString($lastName)){//10
                                            //verificar que money sea string valido
                                            if($this->validation->isValidString($money)){//11
                                                //vefiicar que el account type sea string valido
                                                if($this->validation->isValidString($accountType)){//12
                                                    $query = "INSERT INTO tbuser (userId, name, lastName, username, password, money, accountType, tbUserType_idUserType) VALUES (:userId, :name, :lastName, :username, :password, :money, :accountType, :userType)";

                                                        // Enmascaramos la contraseña
                                                    $encryptedPassword = $this->getProtectedPassword($pass);

                                                    // Los parámetros de ese query
                                                    $params = [
                                                        ":userId" => $userId,
                                                        ":name" => $name,
                                                        ":lastName" => $lastName,
                                                        ":username" => $username,
                                                        ":money" => $money,
                                                        ":accountType" => $accountType,
                                                        ":password" => $encryptedPassword, 
                                                        ":userType" => $userType
                                                    ];

                                                        // Lo ejecutamos
                                                    $createAccountResult = $this->storage->query($query, $params);

                                                    LoggingService::logVariable($createAccountResult, __FILE__, __LINE__);
                                                       
                                                    $isUserCreated= array_key_exists("meta", $createAccountResult) && $createAccountResult["meta"]["count"]==1;

                                                    if($isUserCreated){
                                                        $result["message"]= "User created";
                                                        $result["meta"]["id"]= $createAccountResult["meta"]["id"];
                                                    }else{
                                                        $result["error"] = true;
                                                        $result["message"]= "Error, can't create user";
                                                    }
                                                }else{//12
                                                     $result["error"] = true;
                                                    $result["message"] = "Account type is invalid";
                                                } 
                                            }else{//11
                                                $result["error"] = true;
                                                $result["message"] = "Money value is invalid";
                                            }
                                        }else{//10
                                            $result["error"] = true;
                                            $result["message"] = "Lastname is invalid";
                                        }
                                    }else{//9
                                        $result["error"] = true;
                                        $result["message"] = "Name is invalid";
                                    }
                                }else{//8
                                    $result["error"] = true;
                                    $result["message"] = "User type is invalid";
                                }
                            }else{//7
                                $result["error"] = true;
                                $result["message"] = "Password confirm is invalid";
                            }
                        }else{//6
                            $result["error"] = true;
                            $result["message"] = "Password is invalid";
                        }
                    }else{//5
                        $result["error"] = true;
                        $result["message"] = "User Id is invalid";
                    }
                }else{//3
                    $result["error"] = true;
                    $result["message"] = "Passwords don't match";
                }
            }else{//2
                $result["error"] = true;
                $result["message"] = "Username is unavailable";
            }
        }else{//1
            $result["error"] = true;
            $result["message"] = "All fields are required";
        }

        LoggingService::logVariable($result, __FILE__, __LINE__);
        return $result;

    } //end -registerUser



    /**
     * Edita una cuenta de usuario
     *
     * @param string $firstname
     * @param string $secondname
     * @param string $firstlastname
     * @param string $secondlastname
     * @param int $personalId
     * @param string $email
     * @param string $password
     * @param string $repeatPass

     * @return array
     */  
    public function editUser($userId, $name, $lastName, $username, $money, $accountType, $pass, $repeatPass){
        $result=[];

        $userId= trim($userId);
        $name= trim($name);
        $lastName= trim($lastName);
        $username= trim($username);
        $money= trim($money);
        $accountType= trim($accountType);
        $pass= trim($pass);
        $repeatPass= trim($repeatPass);

        // Verificar que efectivamente vengan todos los datos requeridos.
        if(isset($userId, $name, $lastName, $username, $money, $accountType, $pass, $repeatPass)){ //1
            //Verificar que el username sea uno disponible
            if($this->validation->isValidString($username) && $this->isUsernameAvailableEdit($username, $userId)){//2
                //Verificar que el password y la confirmacion coincidan.
                if($pass == $repeatPass){//3
                    //verificar que el userId contenga al menos 9 caracteres
                    if($this->validation->isValidString($userId) && strlen(trim($userId))>=9){//5
                       //Verificar que el password se string válido y tenga al menos 6 caracteres.
                        if($this->validation->isValidString($pass) && strlen(trim($pass))>=6){//6
                            //Vefificar que la confirmacion de contraseña sea string válido.
                            if($this->validation->isValidString($repeatPass)){//7
                                //Verifwcar que el nombre sea valido   
                                if($this->validation->isValidString($name)){//9
                                    //verificar que el apellido sea un string válido
                                    if($this->validation->isValidString($lastName)){//10
                                        //verificar que money sea string valido
                                        if($this->validation->isValidString($money)){//11
                                            //vefiicar que el account type sea string valido
                                            if($this->validation->isValidString($accountType)){//12
                                                $query = "UPDATE tbuser SET 
                                                        name= :name,
                                                        lastName= :lastName,
                                                        username= :username,
                                                        password= :password, 
                                                        money= :money,
                                                        accountType= :accountType
                                                        WHERE userId= :userId";

                                                    // Enmascaramos la contraseña
                                                $encryptedPassword = $this->getProtectedPassword($pass);

                                                // Los parámetros de ese query
                                                $params = [
                                                    ":userId" => $userId,
                                                    ":name" => $name,
                                                    ":lastName" => $lastName,
                                                    ":username" => $username,
                                                    ":money" => $money,
                                                    ":accountType" => $accountType,
                                                    ":password" => $encryptedPassword
                                                ];

                                                    // Lo ejecutamos
                                                $editAccountResult = $this->storage->query($query, $params);

                                                LoggingService::logVariable($editAccountResult, __FILE__, __LINE__);
                                                   
                                                $isUserEdited= array_key_exists("meta", $editAccountResult) && $editAccountResult["meta"]["count"]==1;

                                                if($isUserEdited){
                                                    $result["message"]= "User edited";
                                                }else{
                                                    $result["error"] = true;
                                                    $result["message"]= "Error, can't edit user";
                                                }
                                            }else{//12
                                                 $result["error"] = true;
                                                $result["message"] = "Account type is invalid";
                                            } 
                                        }else{//11
                                            $result["error"] = true;
                                            $result["message"] = "Money value is invalid";
                                        }
                                    }else{//10
                                        $result["error"] = true;
                                        $result["message"] = "Lastname is invalid";
                                    }
                                }else{//9
                                    $result["error"] = true;
                                    $result["message"] = "Name is invalid";
                                }
                            }else{//7
                                $result["error"] = true;
                                $result["message"] = "Password confirm is invalid";
                            }
                        }else{//6
                            $result["error"] = true;
                            $result["message"] = "Password is invalid";
                        }
                    }else{//5
                        $result["error"] = true;
                        $result["message"] = "User Id is invalid";
                    }
                }else{//3
                    $result["error"] = true;
                    $result["message"] = "Passwords don't match";
                }
            }else{//2
                $result["error"] = true;
                $result["message"] = "Username is unavailable";
            }
        }else{//1
            $result["error"] = true;
            $result["message"] = "All fields are required";
        }

        LoggingService::logVariable($result, __FILE__, __LINE__);
        return $result;

    } //end -editUser


    /**
     * Delete user account by id
     * @param  [string] $userId
     * @return []   
     */
    public function deleteUser($userId){
        $result = [];
        $userId= trim($userId);

        //Verificar que el userId este seteado
        if(isset($userId)){//1
            //Vefiricar que el userId sea string valido y tenga al menos 9 caracteres
            if($this->validation->isValidString($userId) && strlen(trim($userId))>=9){//2
                //query --delete user transactions--
                $query= "DELETE tbtransactxuser, tbtransactions
                        FROM tbuser
                        INNER JOIN tbtransactxuser
                        INNER JOIN tbtransactions
                        ON tbuser.userId = tbtransactxuser.tbUser_userId
                        AND tbtransactxuser.tbTransactios_transactd= tbtransactions.transactId
                        WHERE tbuser.userId= :userId;";

                // Query params
                $params = [":userId" => $userId];
                $deleteResult = $this->storage->query($query, $params);
                
                //Delete user account
                $query= "DELETE FROM tbuser
                        WHERE userId= :userId";

                $deleteResult = $this->storage->query($query, $params);
                LoggingService::logVariable($deleteResult, __FILE__, __LINE__);
                
                $isUserDeleted= array_key_exists("meta", $deleteResult) && $deleteResult["meta"]["count"]==1;
                
                if ($isUserDeleted) {
                    $result["message"] = "User account deleted";
                } else {
                    $result["error"] = true;
                    $result["message"] = "Error deleting user account";
                }
                
            }else{//2
                $result["error"] = true;
                $result["message"] = "User Id format is invalid";
            }
        }else{//1
            $result["error"] = true;
            $result["message"] = "User Id es required";
        }

        return $result;
    }//end deleteUser








    /**
     * Enmascara la contraseña brindada para evitar almacenar las contraseñas en texto plano en la base de datos.
     *
     * @param $password
     * @return string
     */
    private function getProtectedPassword($password) {
        $finalPassword = password_hash($password, PASSWORD_BCRYPT);
        return $finalPassword;
    } //end -getProtectedPassword-


    /**
     * Verifica si un username está disponible para ser utilizado en el sistema.
     *
     * @param string $username
     * @return bool
     */
    private function isUsernameAvailable($username) {
        // El query a ejecutar en la BD
        $query = "SELECT COUNT(*) AS count FROM tbuser WHERE username= :username";

        // Los parámetros de ese query
        $params = [":username" => $username];

        $result = $this->storage->query($query, $params);

        // El resultado esperado de la cuenta es cero
        return $result["data"][0]["count"] == 0;

    }//end -isUsernameAvailable-


    /**
     * Verifica si un username esta disponible para editar una cuenta, sacando su propio id
     *
     * @param string $username
     * @return bool
     */
    private function isUsernameAvailableEdit($username, $userId) {
        // El query a ejecutar en la BD
        $query = "SELECT COUNT(*) AS count FROM tbuser WHERE username= :username AND userId != :userId";

        // Los parámetros de ese query
        $params = [
            ":username" => $username,
            ":userId" => $userId
            ];

        $result = $this->storage->query($query, $params);

        LoggingService::logVariable($result, __FILE__, __LINE__);

        // El resultado esperado de la cuenta es cero
        return $result["data"][0]["count"] == 0;

    }//end -isUsernameAvailableEdit-


}//end -class-


