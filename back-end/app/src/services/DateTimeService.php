<?php
/**
 * Date Service
 * formatear las fechas segun el formato permitido de  la app
 */

namespace App\Services;

use DateTime;

/**
* format as date a string
*/
class DateTimeService{
	
	function getDateTime($dateString){
		$date = new DateTime($dateString);
		return $date->format('Y-m-d H:i:s');
	}





}
