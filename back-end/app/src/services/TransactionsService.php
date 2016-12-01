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
     * @param $type      
     * @param $typeId    
     * @return []           
     */
    public function saveTransaction($userId, $transactId, $date, $amount, $detail, $shop, $type, $typeId){
    	
    	$result=[];

    	$userId= trim($userId);
        $transactId= trim($transactId);
        $date= trim($date);
        $date= $this->getDateTime($date);
        $amount= trim($amount);
        $detail= trim($detail);
        $shop= trim($shop);
        $type= trim($type);
        $typeId= trim($typeId);

        //verificar que todos los campos esten llenos
		if(isset($userId, $transactId, $date, $amount, $type, $typeId)){ //1
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
								//verificar que type code sea string valido
								if($this->validation->isValidString($type)){//9
									//generar el query
									$query= "INSERT INTO tbtransactions (transactId, date, amount, detail, shop, transactType, typeId) VALUES (:transactId, :date, :amount, :detail, :shop, :transactType, :typeId)";

                                            // Los parámetros de ese query
                                            $params = [
                                                ":transactId" => $transactId,
                                                ":date" => $date,
                                                ":amount" => $amount,
                                                ":detail" => $detail,
                                                ":shop" => $shop,
                                                ":transactType" => $type,
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
									$result["message"] = "Type code is invalid";
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



    //getClientId($userId)
    private function getClientId($userId){
    	$result=[];
    	$query="SELECT tbcliente.idCliente
				FROM tbusuario
				INNER JOIN tbcliente
				ON tbusuario.idUsuario = tbcliente.TbUsuario_idUsuario
				WHERE tbusuario.idUsuario= :id";

		$params = [
            ":id" => $userId
        ];

        $getIdResult= $this->storage->query($query, $params);

        $userId = $getIdResult["data"][0];
        $userId= $userId["idUsuario"];

        return $userId;

    }//getClientId



    //createTransactionClientIndex($idTransaction, $userId)
    private function createTransactionClientIndex($idTransaction, $clientId){
    	$result=[];

    	$query= "INSERT INTO tbtransaccionporcliente
				(TbCliente_idCliente, TbTransaccion_idTransaccion)
				VALUES
				(:clientId, :idTransaction)";

		$params= [
			":clientId" => $clientId,
            ":idTransaction" => $idTransaction
		];

		$createIndexResult= $this->storage->query($query, $params);

        $isIndexCreated= array_key_exists("meta", $createIndexResult) && $createIndexResult["meta"]["count"]==1;

        if($isIndexCreated){//17
            $result["message"]= "TransactionClientIndex created";
            $result["meta"]["id"]= $createIndexResult["meta"]["id"];
        }else{
            $result["error"] = true;
            $result["message"]= "Error, can't create TransactionClientIndex";
        }
        return $result;
    }//createTransactionClientIndex


    //createTransactionxEventIndex($idTransaction, $eventId)
    private function createTransactionxEventIndex($idTransaction, $eventId){
    	$result=[];

    	$query= "INSERT INTO tbtransaccionporevento
				(TbTransaccion_idTransaccion, TbEvento_idEvento)
				VALUES
				(:idTransaction, :eventId)";

		$params= [
			":idTransaction" => $idTransaction,
            ":eventId" => $eventId
		];

		$createIndexResult= $this->storage->query($query, $params);

        $isIndexCreated= array_key_exists("meta", $createIndexResult) && $createIndexResult["meta"]["count"]==1;

        if($isIndexCreated){//17
            $result["message"]= "TransactionxEventIndex created";
            $result["meta"]["id"]= $createIndexResult["meta"]["id"];
        }else{
            $result["error"] = true;
            $result["message"]= "Error, can't create TransactionxEventIndex";
        }
        return $result;
    }//createTransactionClientIndex


    //seatsSiteEventIndex($eventId, $siteId, $sectionId, $seatsList);
    // private function seatsSiteEventIndex($eventId, $siteId, $sectionId, $seatsList){
    // 	foreach ($seatsList as $key => $value) {
    // 		# code...
    // 	}
    // }












}//end -class-