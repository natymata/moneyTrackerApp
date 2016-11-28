<?php

/**
 * TransactionsService.php
 */

namespace App\Services;

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



    public function getReservedSeats($zoneId, $siteId, $eventId){
    	$result=[];
    	$zoneId= trim($zoneId);
    	$siteId= trim($siteId); 
    	$eventId= trim($eventId);

    	//vefiricar que los tres capmpos esten
		if(isset($zoneId, $siteId, $eventId)){ //1
			//vefiricar que el id sitio sea numerico
			if($this->validation->isValidInt($siteId)){//2
				//verificar que el id del evento se numerico
				if($this->validation->isValidInt($eventId)){//3
					//vefiricar que el id de zona sea string valido
					if($this->validation->isValidString($zoneId)){//4
						//si todas las validaciones pasan hacemos la consulta
						
						$query= "SELECT idAsiento
							FROM tbbutacasporsitioporevento
							WHERE idEvento= :eventId
							AND idSitio= :siteId
							AND idSeccion= :zoneId";

						$params = [
				            ":eventId" => $promoterId, 
				            ":siteId" => $idEvent,
				            ":zoneId" => $zoneId
				        ];

				        $reservedSeatsResult = $this->storage->query($query, $params);

			            $foundRecord = array_key_exists("meta", $reservedSeatsResult) &&
			                $reservedSeatsResult["meta"]["count"] > 0;

			            if ($foundRecord) {

			                $result["message"] = "Records found";
			                $seatsList = $reservedSeatsResult["data"];

			                foreach ($seatsList as $seat) {
			                    $result["data"][] = [
			                        "seatId" => $seat["idAsiento"]
			                    ];
			                } 
			            } else {
			                $result["message"] = "Records not found";
			                $result["error"] = true;
			            }
					}else{//4
						$result["error"] = true;
            			$result["message"] = "Invalid zona id";
					}
				}else{//3
					$result["error"] = true;
            		$result["message"] = "Invalid event id";
				}
			}else{//2
				$result["error"] = true;
            	$result["message"] = "Invalid site id";
			}
		}else{//1
			$result["error"] = true;
            $result["message"] = "Empty required fields";
		}


    	return $result;
    }//getReservedSeats



    /*saveTransaction($transactionType, $siteType, $eventId, $siteId, $userId, $sectionId, $seatsList, $seatsAmount , $transactionCode);*/
    public function saveTransaction($transactionType, $siteType, $eventId, $siteId, $userId, $sectionId, $seatsList, $seatsAmount , $transactionCode){
    	
    	$result=[];

    	$transactionType= trim($transactionType);  
        $siteType= trim($siteType); 
        $eventId= trim($eventId);
        $siteId=trim($siteId); 
        $userId=trim($userId); 
        $sectionId= trim($sectionId); 
        $seatsList= $seatsList;
        $seatsAmount= trim($seatsAmoun);
        $transactionCode= trim($transactionCode); 

        $result["error"] = true;
        $result["message"] = "is invalid";

        //verificar que todos los campos esten llenos
		if(isset($transactionType, $siteType, $eventId, $siteId, $userId, $sectionId, $seatsList, $seatsAmount , $transactionCode)){ //1
			//Verifacar que el tipo de transaccion sea numero
			if($this->validation->isValidInt($transactionType)){//2
				//veriifacar que el site type sea valido
				if($this->validation->isValidInt($siteType)){//3
					//vefiricar que el eventId sea numero
					if($this->validation->isValidInt($eventId)){//4
						//verificar que el site id sea un numero
						if($this->validation->isValidInt($siteId)){//5
							//verificar que el user id sea un numero
							if($this->validation->isValidInt($userId)){//6
								//verificar que el section id sea un string valido 
								if($this->validation->isValidString($sectionId)){//7
									//verificar que el seatsAmount sea un numero 
									if($this->validation->isValidInt($seatsAmount)){//8
										//verificar que transaction code sea string valido
										if($this->validation->isValidString($transactionCode)){//9
											//si todas las validaciones son correctas procedemos a guardar la transaccion
											
											$result= $this->saveTransaction($transactionCode, $seatsAmount, $transactionType);
											
											$idTransaction = $result["meta"];
                                            $idTransaction= $idTransaction["id"];

                                            LoggingService::logVariable($idTransaction, __FILE__, __LINE__);

                                            $clientId= $this->getClientId($userId);

                                            $resultIndexTransactionxClient= $this->createTransactionClientIndex($idTransaction, $clientId);

                                            $result["createTransactionClientIndex"] = $resultIndexTransactionxClient;

                                            $resultIndexTransactionxEvent= $this->createTransactionxEventIndex($idTransaction, $eventId);

                                            $result["TransactionxEventIndex"]= $resultIndexTransactionxEvent;

										}else{//9
											$result["error"] = true;
        									$result["message"] = "transactionCode is invalid";
										}
									}else{//8
										$result["error"] = true;
        								$result["message"] = "seats amount is invalid";
									}
								}else{//7
									$result["error"] = true;
        							$result["message"] = "section id is invalid";
								}
							}else{//6
								$result["error"] = true;
        						$result["message"] = "user id is invalid";
							}
						}else{//5
							$result["error"] = true;
        					$result["message"] = "site id is invalid";
						}
					}else{//4
						$result["error"] = true;
        				$result["message"] = "event id is invalid";
					}
				}else{//3
					$result["error"] = true;
        			$result["message"] = "site type is invalid";
				}
			}else{//2
				$result["error"] = true;
        		$result["message"] = "transaccion type is invalid";
			}
		}else{//1
			$result["error"] = true;
            $result["message"] = "Empty required fields";
		}

    	return $result;
    }//saveTransaction



    private function saveTransaction($transactionCode, $seatsAmount, $transactionType){
    	$result=[];

    	$query= "INSERT INTO tbtransaccion
			(Codigo, CantidadEspacios, TbTipoTransaccion_idTipoTransaccion)
			VALUES
			(:transactionCode, :seatsAmount, :transactionType)";

		$params= [
			":transactionCode" => $transactionCode,
            ":seatsAmount" => $seatsAmount,
            ":transactionType" => $transactionType,
		];

		$saveTransactionResult= $this->storage->query($query, $params);

        $isTransactionCreated= array_key_exists("meta", $saveTransactionResult) && $saveTransactionResult["meta"]["count"]==1;

        if($isTransactionCreated){//17
            $result["message"]= "Transaction created";
            $result["meta"]["id"]= $saveTransactionResult["meta"]["id"];
        }else{
            $result["error"] = true;
            $result["message"]= "Error, can't event";
        }
        return $result;
    }//saveTransaction



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