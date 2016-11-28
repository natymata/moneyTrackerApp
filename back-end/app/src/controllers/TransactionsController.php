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

    public function getReservedSeats($request){
    	$result = [];
        $formData = $request->getParsedBody();

        $zoneId= null; 
        $siteId= null; 
        $eventId= null;

        if(array_key_exists("zoneId", $formData)){
            $zoneId= $formData["zoneId"];
        }

        if(array_key_exists("siteId", $formData)){
            $siteId= $formData["siteId"];
        }

        if(array_key_exists("name", $formData)){
            $name= $formData["name"];
        }

        $getReservedResult= $this->transactionsService->getReservedSeats($zoneId, $siteId, $eventId);

        if(array_key_exists("error", $getReservedResult)) {
            $result["error"] = true;
            $result["message"] = $getReservedResult["message"];
            $result["valid"] = false;
        }else{
            $result["message"] = $getReservedResult["message"];
            $result["valid"] = true;
            $result["data"]= $getReservedResult["data"];
        }
        return $result;
    }//getReservedSeats


   // saveTransaction($request)
    public function saveTransaction($request){
        $result=[];
        $formData= $request->getParsedBody();

        $transactionType= null; 
        $siteType= null; 
        $eventId= null;
        $siteId= null;
        $userId= null;
        $sectionId= null; 
        $seatsList= null;
        $seatsAmount= null; 
        $transactionCode= null; 

        if(array_key_exists("transactionType", $formData)){
            $transactionType= $formData["transactionType"];
        }

        if(array_key_exists("siteType", $formData)){
            $siteType= $formData["siteType"];
        }

        if(array_key_exists("eventId", $formData)){
            $eventId= $formData["eventId"];
        }

        if(array_key_exists("siteId", $formData)){
            $siteId= $formData["siteId"];
        }

        if(array_key_exists("userId", $formData)){
            $userId= $formData["userId"];
        }

        if(array_key_exists("sectionId", $formData)){
            $sectionId= $formData["sectionId"];
        }

        if(array_key_exists("seatsList", $formData)){
            $seatsList= $formData["seatsList"];
        }

        if(array_key_exists("seatsAmount", $formData)){
            $seatsAmount= $formData["seatsAmount"];
        }

        if(array_key_exists("transactionCode", $formData)){
            $transactionCode= $formData["transactionCode"];
        }

        $registerResult= $this->eventsService->saveTransaction($transactionType, $siteType, $eventId, $siteId, $userId, $sectionId, $seatsList, $seatsAmount , $transactionCode);

        if(array_key_exists("error", $registerResult)) {
            $result["error"] = true;
            $result["message"] = $registerResult["message"];
            $result["valid"] = false;
        }else{
            $result["message"] = $registerResult["message"];
            $result["valid"] = true;
        }

         return $result;

    }//saveTransaction










   


}//end -class-