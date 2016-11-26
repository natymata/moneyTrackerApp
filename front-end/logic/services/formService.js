angular.module('bankAccount.services')
.service('formService', function() {

	var clearForm= function (formName, $scope) {
		if ($scope.formName) {
	            $scope.formName.$setPristine();
	            $scope.formName.$setUntouched();
	    }
	}; 

//puntos de acceso de los metodos del servicio:
	return{
		clearForm:clearForm
	};
});//end -service-


