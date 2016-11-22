angular.module('bankAccount.controllers') 
.controller("detailController", function ($routeParams, userService, transactService, $timeout, $location) {
	var detail= this;

	detail.init= function() {
		detail.userId= userService.getCurrentUser().userId;
		detail.transactId= $routeParams.transactId;
		detail.money= userService.getCurrentUser().money;
		detail.transact= transactService.getTransactById(detail.transactId);
		detail.info="";
		detail.showModal= false;
	};

	detail.deleteTransact= function() {
		var result= transactService.deleteTransact(detail.transactId);
		if(!result.error){
			detail.info= result.string;
			detail.showModal= true;
			modal(true);
		}else{
			detail.info= result.string;
			detail.showModal= true;
			modal(false);
		}
	};

	var modal= function(result) {
		$timeout(function(){
			detail.showModal= false;
			if(result){
				$location.path("summary/" + detail.userId);
			};
		}, 2000);	
	};






/*
	$window.location.href = ('#/admin');
 */
/*
var transactInfo= {
			transactId:id,
			date: transact.date,
			amount:transact.amount,
			detail: transact.detail,
			shop: transact.shop,
			type: transact.type,
			typeId:typeId,
			userId: userId
		};
 */


	detail.init();
	/*
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
*/

});

