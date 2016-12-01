<?php
/**
 * ValidationService.php
 * Distintas validaciones independendientes de la lógica de negocios.
 */

namespace App\Services;

use DateTime;


class ValidationService{
    /**
     * Verifica si una cadena de texto puede ser considerada texto válido.
     * @param string $stringToCheck
     * @return bool
     */
    function isValidString($stringToCheck) {
        if (isset($stringToCheck)) {
            $trimmed = trim($stringToCheck);

            if (strlen($trimmed) > 0) {
                return true;
            }
        }

        return false;
    }

    /**
    * Verifica si un valor es considerado un entero válido.
    * @param $intToCheck
    * @return bool
    */
    function isValidInt($intToCheck) {
        if (isset($intToCheck)) {
            if(is_numeric($intToCheck)){
                return true;
            }
        }
        return false;
    }

    /**
     * Verifica si un string dado esta en formato de fechas aceptado por a aplicacion: "Y-m-d H:i:s"
     * @param  string $date
     * @param  string $format
     * @return boolean
     */
    function isValidDateTime($date, $format = 'Y-m-d H:i:s'){
        //$d = date_create_from_format($format, $date);
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    function isValidDate($date, $format = 'Y-m-d'){
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    function isValidTime($date, $format = 'H:i:s'){
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    /**
     * Verifica que el dato ingresado se un currency valido
     * @param  $string 
     * @return boolean       
     */
    function isCurrency($string){
      return preg_match("/^-?[0-9]+(?:\.[0-9]{1,2})?$/", $string);
    }


    /**
     * Convierte a formato valido de hora un string
     * @param  string $timeString string de hora
     * @return string 
     */
    function getTime($timeString){
            $date = new DateTime($timeString);
            return  $date->format('H:i:s');
    }



    
}//end -class-
