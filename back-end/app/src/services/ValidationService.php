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
     * Verifica si un string es un email valido
     *
     * @param string $email
     * @return bool
     */
    function isValidEmail($email) {
        return $this->isValidString($email) ? filter_var($email, FILTER_VALIDATE_EMAIL) : false;
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
    * Check minimum age.
    * @param    string $dob The date of birth
    * @param    int $minAge  Minimum age allowed 
    * @return    bool
    */
    function isValidMinAge( $dob, $minAge){
        $dob     = new DateTime( $dob );
        $minAge = new DateTime( 'now - ' . $minAge . 'years' );

        return $dob <= $minAge;
    }


    /**
     * Check max age. Max age= 100 years
     * @param  string $dbo date of birth
     * @return boolean
     */
    function isValidMaxAge($dob){
        $dateNow= new DateTime("now");
        $dob= new DateTime($dob);
        $interval = $dateNow->diff($dob);
        
        $result= $interval->format('%R%a');

        if($result<(-36525)){
            return false;
        }else{
            return true;
        }
    }


    /**
     * Verifica que el formato de genero sea el correcto
     * @param  string genre
     * @return boolean
     */
    function isValidGenre($genre){
        if($genre=="f" || $genre=="m"){
            return true;
        }else{
            return false;
        }
    }


    /**
     * Verifica si un email está disponible para ser utilizado en el sistema.
     *
     * @param string $email
     * @return bool
     */
    private function isEmailAvailable($email) {
        // El query a ejecutar en la BD
        $query = "SELECT COUNT(*) AS count FROM tbusuario WHERE email = :email";

        // Los parámetros de ese query
        $params = [":email" => $email];

        $result = $this->storage->query($query, $params);

        LoggingService::logVariable($result);

        // El resultado esperado de la cuenta es cero
        return $result["data"][0]["count"] == 0;

    }//end -isEmailAvailable-


    /**
     * verifica que la fecha de creacion del evento sea al menos con 15 dias de anticipacion
     * @param  string  $eventDate fecha de realizacion del evento inresada por el usuario
     * @return boolean            
     */
    function isValidEventDate($eventDate){
        $dateNow= new DateTime("now");
        $eventDate= new DateTime($eventDate);
        $interval = $dateNow->diff($eventDate);
        
        $result= $interval->format('%R%a');

        if($result>=(13)){
            return true;
        }else{
            return false;
        }
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

    /**
     * vefirica que  la ahora de inicio sea menor que la hora de finalizacion
     * @param  $startHour
     * @param  $endHour 
     * @return boolean
     */
    function validateEventTimes($startHour, $endHour){
       // $startHour= $this->getTime($this->$startHour);
       // $endHour= $this->getTime($this->$endHour);
       $startHour= new DateTime($startHour);
       $startHour= $startHour->format('H:i:s');

       $endHour= new DateTime($endHour);
       $endHour= $endHour->format('H:i:s');

        if($startHour < $endHour){
            return true;
        }else{
            return false;
        }
    }









    
}//end -class-
