<?php


namespace App\Controllers;

use App\Services\LoggingService;
use App\Services\TransactionsService;
use Slim\Http\Request;


class TransactionsController{

	private $transactionsService;
	
	public function __construct() {
        $this->transactionsService = new TransactionsService();
    }


   // saveTransaction($request)
    public function saveTransaction($request){
        $result=[];
        $formData= $request->getParsedBody();

        $userId= null;
        $transactId= null; 
        $date= null; 
        $amount= null; 
        $detail= null; 
        $shop= null; 
        $transactType= null;
        $typeId= null;

        LoggingService::logVariable($formData, __FILE__, __LINE__);

        if(array_key_exists("userId", $formData)){
            $userId= $formData["userId"];
        }

        if(array_key_exists("transactId", $formData)){
            $transactId= $formData["transactId"];
        }

        if(array_key_exists("date", $formData)){
            $date= $formData["date"];
        }

        if(array_key_exists("amount", $formData)){
            $amount= $formData["amount"];
        }

        if(array_key_exists("detail", $formData)){
            $detail= $formData["detail"];
        }

        if(array_key_exists("shop", $formData)){
            $shop= $formData["shop"];
        }

        if(array_key_exists("transactType", $formData)){
            $transactType= $formData["transactType"];
        }

        if(array_key_exists("typeId", $formData)){
            $typeId= $formData["typeId"];
        }

        $registerResult= $this->transactionsService->saveTransaction($userId, $transactId, $date, $amount, $detail, $shop, $transactType, $typeId);

        if(array_key_exists("error", $registerResult)) {
            $result["error"] = true;
            $result["message"] = $registerResult["message"];
            $result["valid"] = false;
        }else{
            $result["message"] = $registerResult["message"];
            $result["valid"] = true;
            $result["error"] = false;
            $result["indexMessage"]= $registerResult["indexMessage"];
        }

         return $result;

    }//saveTransaction


    /**
     * Get all transaact by user id
     * @param  $request
     * @param  $args
     * @return []
     */
    public function getTransactByUserId($request){
        $result = [];
        $userId = $request->getAttribute("userId", null);
        LoggingService::logVariable($userId, __FILE__, __LINE__);

        return $this->transactionsService->getTransactByUserId($userId);
    }//end getTransactByUserId


    /**
     * get a trasact details by it's id
     * @param  $request 
     * @return [] 
     */
    public function getTransactById($request){
        $result = [];
        $transactId = $request->getAttribute("transactId", null);
        LoggingService::logVariable($transactId, __FILE__, __LINE__);

        return $this->transactionsService->getTransactById($transactId);
    }//end getTransactById


    /**
     * Delete a transaction
     * @param  $request 
     * @return []  
     */
    public function deleteTransact($request){
        $result = [];
        $transactId = $request->getAttribute("transactId", null);
        LoggingService::logVariable($transactId, __FILE__, __LINE__);

        return $this->transactionsService->deleteTransact($transactId);
    }//end deleteTransact







   


}//end -class-