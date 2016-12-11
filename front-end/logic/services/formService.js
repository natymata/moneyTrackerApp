angular.module('bankAccount.services')
.service('formService', function() {

	//clear a form
	var clearForm= function (formName) {
		if (formName) {
            formName.$setPristine();
            formName.$setUntouched();
	    }else{
	    	alert("form doesn't exists");
	    }
	}; 

//puntos de acceso de los metodos del servicio:
	return{
		clearForm:clearForm
	};
});//end -service-


