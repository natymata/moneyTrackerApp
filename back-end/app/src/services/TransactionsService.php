<?php

/**
 * TransactionsService.php
 */

namespace App\Services;

use DateTime;

class TransactionsService {

    private $storage;
    private $validation;

    /**
     * TransactionsService constructor.
     */
    public function __construct() {
        $this->storage = new StorageService();
        $this->validation = new ValidationService();
    }


    /**
     * Saves an user transaction
     * @param $userId    
     * @param $transactId
     * @param $date      
     * @param $amount    
     * @param $detail    
     * @param $shop      
     * @param $transactType      
     * @param $typeId    
     * @return []           
     */
    public function saveTransaction($userId, $transactId, $date, $amount, $detail, $shop, $transactType, $typeId){
    	
    	$result=[];

    	$userId= trim($userId);
        $transactId= trim($transactId);
        $date= trim($date);
        $date= $this->getDateTime($date);
        $amount= trim($amount);
        $detail= trim($detail);
        $shop= trim($shop);
        $transactType= trim($transactType);
        $typeId= trim($typeId);

        //verificar que todos los campos esten llenos
		if(isset($userId, $transactId, $date, $amount, $transactType, $typeId)){ //1
			//Verificar que el user id sea válido
			if($this->validation->isValidString($userId) && strlen(trim($userId))>=9){//2
				//Verificar que el transact id sea válido
				if($this->validation->isValidString($transactId) && strlen(trim($transactId))>=9){//3
					//verificar que la fecha sea una valida
					if($this->validation->isValidDateTime($date) || $this->validation->isValidDate($date)){//4
						//verificar que la cantidad tenga el formato valido
						if($this->validation->isCurrency($amount)){//5
							//verificar que el type id sea numerico y sea un numero entre 0 y 1
							if($this->validation->isValidInt($typeId) && strlen(trim($typeId))==1 && ($typeId>=0 && $typeId <=1)){//8
								//verificar que transactType code sea string valido
								if($this->validation->isValidString($transactType)){//9
									//generar el query
									$query= "INSERT INTO tbtransactions (transactId, date, amount, detail, shop, transactType, typeId) VALUES (:transactId, :date, :amount, :detail, :shop, :transactType, :typeId)";

                                            // Los parámetros de ese query
                                            $params = [
                                                ":transactId" => $transactId,
                                                ":date" => $date,
                                                ":amount" => $amount,
                                                ":detail" => $detail,
                                                ":shop" => $shop,
                                                ":transactType" => $transactType,
                                                ":typeId" => $typeId
                                            ];

                                            // Lo ejecutamos
                                            $createTransactResult = $this->storage->query($query, $params);

                                            LoggingService::logVariable($createTransactResult, __FILE__, __LINE__);
                                               
                                            $isTransactCreated= array_key_exists("meta", $createTransactResult) && $createTransactResult["meta"]["count"]==1;

                                            if($isTransactCreated){//a
                                                $result["message"]= "Transaction created";
                                                //$result["meta"]["id"]= $createTransactResult["meta"]["id"];
                                                
                                                //si la transaccion se creo exitosamente se crea el indice de relaciones
                                                $query = "INSERT INTO tbtransactxuser (tbUser_userId, tbTransactios_transactd) VALUES (:userId, :transactId)";

                                                // Los parámetros de ese query
                                                $params = [
                                                    ":userId" => $userId,
                                                    ":transactId" => $transactId
                                                ];

                                                    // Lo ejecutamos
                                                $createIndexResult = $this->storage->query($query, $params);

                                                LoggingService::logVariable($createIndexResult, __FILE__, __LINE__);
                                                   
                                                $isIndexCreated= array_key_exists("meta", $createIndexResult) && $createIndexResult["meta"]["count"]==1;

                                                if($isIndexCreated){//b
                                                    $result["indexMessage"]= "Index created";
                                                }else{//b
                                                    $result["error"] = true;
                                                    $result["indexMessage"]= "Error, can't create index";
                                                }
                                            }else{//a
                                                $result["error"] = true;
                                                $result["message"]= "Error, can't create transaction";
                                            }
								}else{//9
									$result["error"] = true;
									$result["message"] = "Transact type code is invalid";
								}
							}else{//8
								$result["error"] = true;
								$result["message"] = "Type id is invalid";
							}
								
							
						}else{//5
							$result["error"] = true;
        					$result["message"] = "site id is invalid";
						}
					}else{//4
						$result["error"] = true;
        				$result["message"] = "Date format is invalid";
					}
				}else{//3
					$result["error"] = true;
        			$result["message"] = "Transaction Id format is invalid";
				}
			}else{//2
				$result["error"] = true;
        		$result["message"] = "User id format is invalid";
			}
		}else{//1
			$result["error"] = true;
            $result["message"] = "Empty required fields";
		}

    	return $result;
    }//saveTransaction

    function getDateTime($dateString){
		$date = new DateTime($dateString);
		return $date->format('Y-m-d H:i:s');
	}

    /**
     * Get all user transactions by user Id
     * @param  string $userId
     * @return []  
     */
    public function getTransactByUserId($userId){
        $result = [];
        $userId= trim($userId);

        //Verificar que el userId este seteado
        if(isset($userId)){//1
            //Vefiricar que el userId sea string valido y tenga al menos 9 caracteres
            if($this->validation->isValidString($userId) && strlen(trim($userId))>=9){//2
                //set the query
                $query= "SELECT tbtransactions.transactId, tbtransactions.date, tbtransactions.amount, tbtransactions.shop, tbtransactions.typeId
                    FROM tbtransactions
                    INNER JOIN tbtransactxuser
                    INNER JOIN tbuser
                    ON tbtransactions.transactId = tbtransactxuser.tbTransactios_transactd
                    AND tbtransactxuser.tbUser_userId = tbuser.userId
                    WHERE tbuser.userId= :userId AND tbuser.Active= 1 ORDER BY date desc LIMIT 200";

                    // Query params
                    $params = [":userId" => $userId];

                    $getUserTransactResult = $this->storage->query($query, $params);

                    $foundRecord = array_key_exists("meta", $getUserTransactResult) &&
                        $getUserTransactResult["meta"]["count"] > 0;

                    if ($foundRecord) {
                        $result["message"] = "User transactions found";
                        $transactList = $getUserTransactResult["data"];

                        foreach ($transactList as $transact) {
                            $result["data"][] = [
                                "transactId" => $transact["transactId"],
                                "date" => $transact["date"],
                                "amount" => $transact["amount"],
                                "shop" => $transact["shop"],
                                "typeId" => $transact["typeId"]
                            ];
                        } 
                    } else {
                        $result["message"] = "User transactions not found";
                        $result["error"] = true;
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
    }//end getTransactByUserId


    /**
     * Get an especific transaction info by transaction id
     * @param  $transactId
     * @return []     
     */
    public function getTransactById($transactId){
        $result = [];
        $transactId= trim($transactId);

        //Verificar que el transactId este seteado
        if(isset($transactId)){//1
            //Vefiricar que el transactId sea string valido y tenga al menos 9 caracteres
            if($this->validation->isValidString($transactId) && strlen(trim($transactId))>=9){//2
                //set the query
                $query= "SELECT transactId, date, amount, detail, shop, typeId FROM tbtransactions 
                WHERE transactId= :transactId AND Active= 1 LIMIT 1";

                    // Query params
                    $params = [":transactId" => $transactId];

                    $getTransactResult = $this->storage->query($query, $params);

                    $foundRecord = array_key_exists("meta", $getTransactResult) &&
                        $getTransactResult["meta"]["count"] > 0;

                    if ($foundRecord) {
                        $result["message"] =  "Transaction found";
                        $result["found"]= true;
                        $transactList = $getTransactResult["data"];

                        foreach ($transactList as $transact) {
                            $result["data"][] = [
                                "transactId" => $transact["transactId"],
                                "date" => $transact["date"],
                                "amount" => $transact["amount"],
                                "detail" => $transact["detail"],
                                "shop" => $transact["shop"],
                                "typeId" => $transact["typeId"]
                            ];
                        } 
                    } else {
                        $result["message"] = "Transaction not found";
                        $result["error"] = true;
                    }
            }else{//2
                $result["error"] = true;
                $result["message"] = "Transaction Id format is invalid";
            }
        }else{//1
            $result["error"] = true;
            $result["message"] = "Transaction Id es required";
        }
        return $result;
    }//end getTransactByUserId



    public function deleteTransact($transactId){
        $result = [];
        $transactId= trim($transactId);

        //Verificar que el transactId este seteado
        if(isset($transactId)){//1
            //Vefiricar que el transactId sea string valido y tenga al menos 9 caracteres
            if($this->validation->isValidString($transactId) && strlen(trim($transactId))>=9){//2
                //set the query
                $query= "DELETE FROM tbtransactions WHERE transactId= :transactId";

                // Query params
                $params = [":transactId" => $transactId];

                $deleteResult = $this->storage->query($query, $params);
                
                LoggingService::logVariable($deleteResult, __FILE__, __LINE__);
                
                $isTransactDeleted= array_key_exists("meta", $deleteResult) && $deleteResult["meta"]["count"]==1;
                
                if ($isTransactDeleted) {
                    $result["message"] = "Transaction deleted";
                    $result["deleted"] = true;
                } else {
                    $result["error"] = true;
                    $result["message"] = "Error deleting transaction";
                    $result["deleted"] = false;
                }

            }else{//2
                $result["error"] = true;
                $result["message"] = "Transaction Id format is invalid";
            }
        }else{//1
            $result["error"] = true;
            $result["message"] = "Transaction Id es required";
        }
        return $result;
    }//end deleteTransact
















}//end -class-