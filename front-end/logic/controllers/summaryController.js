angular.module('bankAccount.controllers') 
.controller("summaryController", function(userService, $routeParams, transactService) {
	var summary= this;

	summary.init= function() {
		summary.userId= $routeParams.userId;
		summary.userName= userService.getCurrentUser().name;
		summary.accountType= userService.getCurrentUser().accountType;
		summary.money= userService.getCurrentUser().money;
		summary.welcome= "Bienvenid@" + " " + summary.userName;
		summary.userTransacts= transactService.getTransactByUserId(summary.userId);
		summary.showElements= showElements(summary.userTransacts);
		summary.balance= getBalance(summary.userTransacts);
	};

	var showElements= function(userTransacts) {
		if(userTransacts.length>0){
			return true;
		}else{
			return false;
		}
	};//end, function

	var getBalance= function(userTransacts) {
		var balance=0;
		var credits= getTotal(userTransacts, 1);
		var debits= getTotal(userTransacts, 0);
		balance= credits - debits;
		return balance;
	};

	var getTotal= function (pList, type) {
		var total= 0;
		for(i=0; i<pList.length; i++) {
			if(pList[i].typeId==type){
				total+= pList[i].amount;
			}
		}
		return total;
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
	

});
