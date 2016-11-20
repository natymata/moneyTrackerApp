angular.module('bankAccount.controllers') 
.controller("detailController", ['$scope', 'BDService', '$routeParams', function ($scope, BDService, $routeParams) {

	//obtener desde el local storage el usuario logeado
	var loggedUser= BDService.getloggedUser();
	var transactId= Number($routeParams.trsId);
	$scope.userId= loggedUser.id;
	$scope.money= loggedUser.money;
	
	//Parseando el objeto usuario
	var objeto= angular.fromJson(loggedUser);
	
	//agregar metodo al usuario para aceder a las transacciones
	objeto.getTransact= function () {
		return objeto.transac;
	};

	//poniendo en un array todos los objetos transaccion
	var transactList= objeto.getTransact();
	
	//funcion que escoge de la lista transactList el objeto transaccion actual
	var getSelectedObject= function (pId) {
		var result= transactList.filter(function (item) {
			return item.id== pId;
		});
		return result;
	};

	//guardar en una variable el objeto transaccion para mostrarlo al usuario
	$scope.transact=[];
	$scope.transact=(getSelectedObject(transactId));
	$scope.transact= $scope.transact[0];


	//Funciones para eliminar una transaccion

	//esta es la funcion que se llama desde el html para elimarnar la transaccion y persistir en storage
	$scope.deleteTransact= function () {
		var index= transactList.indexOf($scope.transact);
		transactList.splice(index,1);
		BDService.updateLoggedUser();
	};


}]);

