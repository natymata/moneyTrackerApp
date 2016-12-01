angular.module('bankAccount.controllers') 
.controller("detailController", function ($routeParams, userService, transactService, $timeout, $location) {
	var detail= this;

	detail.init= function() {
		detail.userId= userService.getCurrentUser().userId;
		detail.transactId= $routeParams.transactId;
		detail.money= userService.getCurrentUser().money;
		detail.info="";
		detail.error="";
		detail.showModal= false;
		transactService.getTransactById(detail.transactId)
		.success(function(response){
			if(response.found){
				detail.transact= setData(response.data);
			}else{
				detail.error="No se ha podido encontrar la transacción";
				console.error(response.message);
			};
		})
		.error(function(response){
			detail.error="No se ha podido encontrar la transacción";
			console.error(response.message);
		});
	};

	var setData= function(dataArr) {
		angular.forEach(dataArr, function(transact) {
			var date= transact.date;
			date= new Date();
			transact.date= date;

			if(transact.typeId== "0"){
				transact.transactType="Débito";
			}else{
				transact.transactType= "Crédito";
			};

			if(transact.detail == ""){
				transact.detail = "No registrado";
			};

			if(transact.shop == ""){
				transact.shop = "No registrado";
			};
		});
		return dataArr[0];	
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

	detail.init();
	
/*
	$window.location.href = ('#/admin');
 */


});