angular.module('bankAccount.services')
.service('formService', ['localStorageService', function(localStorageService) {

	var clearForm= function (formName, $scope) {
		if ($scope.formName) {
	            $scope.formName.$setPristine();
	            $scope.formName.$setUntouched();
	    }
	}; //fin function

    


//puntos de acceso de los metodos del servicio:
	return{
		clearForm:clearForm
	};
}]);//end -service-


