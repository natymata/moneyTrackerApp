angular.module('bankAccount.controllers') 
.controller("summaryController", ['userService', '$routeParams', function (userService, $routeParams) {
	var summary= this;

	summary.init= function() {
		summary.userId= $routeParams.userId;
		summary.userName= userService.getCurrentUser().name;
		summary.welcome= "Bienvenid@" + " " + summary.userName;
	};


	summary.init();

	/*
	$scope.loggedUserId= loggedUser.id;
	$scope.money= loggedUser.money;
	$scope.type= loggedUser.type;
	$scope.users= BDService.getAll();
	console.log($scope.users);

	//Mensaje de bienvenida
	$scope.welcome= "Bienvenid@ " + loggedUser.name;

	//Parseando el objeto usuario
	var objeto= angular.fromJson(loggedUser);
	
	//agregar metodo al usuario para aceder a las transacciones
	objeto.getTransact= function () {
		return objeto.transac;
	};

	//array que contiene los objetos transaccion
	$scope.transatList= objeto.getTransact();
	$scope.showTable= (function () {
		if($scope.transatList.length>0){
			return true;
		}else{
			return false;
		}
	})();

	//funciones para obtener el saldo

	//escoger un tipo de transaccion
	var getTypeOfTransact= function (type) {
		var result= $scope.transatList.filter(function (item) {
			return item.type== type;
		});
		return result;
	};

	//crear lista de creditos y lista de débitos
	var creditsList= getTypeOfTransact("Crédito");
	var debitsList= getTypeOfTransact("Débito");

	var getTotal= function (pList) {
		var total= 0;
		for(i=0; i<pList.length; i++) {
			total+= pList[i].amount;
		}
		return total;
	};

	//sacar el balance de la cuenta
	var balance= function () {
		var balance=0;
		var credits= getTotal(creditsList);
		var debits= getTotal(debitsList);	
		balance= credits - debits;
		return balance;
	};

	$scope.balance= balance();*/
	

}]);
