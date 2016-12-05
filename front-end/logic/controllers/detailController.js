angular.module('bankAccount.controllers') 
.controller("detailController", function ($routeParams, userService, transactService, $timeout, $location, $scope) {
	var detail= this;

	//init values
	detail.init= function() {
		$scope.selectedTab(2); //set active class
		detail.isLoading= true;
		detail.userId= userService.getCurrentUser().userId;
		detail.transactId= $routeParams.transactId;
		detail.money= userService.getCurrentUser().money;
		detail.info="";
		detail.error="";
		detail.showModal= false;
		detail.confirmModal= false;
		getTransact();
 	};//end init

	//Get the transaction to display
	var getTransact= function() {
		transactService.getTransactById(detail.transactId)
		.success(function(response){
			if(response.found){
				detail.transact= transactService.setData(response.data);
				detail.transact= detail.transact[0];
				detail.isLoading= false;
			}else{
				detail.isLoading= false;
				detail.error="No se ha podido encontrar la transacción";
				console.error(response.message);
			};
		})
		.error(function(response){
			detail.isLoading= false;
			detail.error="Error, No se ha podido encontrar la transacción";
			console.error(response.message);
		});
	};//end getTransact

	//shows delete confirm modal
	detail.delete= function(){
		detail.confirmModal= true;
	};//end

	//deltes a transaction
	detail.deleteTransact= function() {
		transactService.deleteTransact(detail.transactId)
		.success(function(response){
			detail.confirmModal= false;
			if(response.deleted){
				detail.info= "Transacción eliminada con éxito";
				detail.showModal= true;
				modal(true);
			}else{
				console.error(response.message);
				detail.info= "No se ha podido completar la operación";
				detail.showModal= true;
				modal(false);
			};
		})
		.error(function(response){
			console.error(response.message);
			detail.info= "No se ha podido completar la operación";
			detail.showModal= true;
			modal(false);
		});
	};//end deleteTransact

	//hides confirm modal and redirect to summary
	var modal= function(result) {
		$timeout(function(){
			detail.showModal= false;
			if(result){
				$location.path("summary/" + detail.userId);
			};
		}, 2000);	
	};//end modal

	//cancel delete transact
	detail.cancelDelete= function(){
		detail.confirmModal= false;
	};

	detail.init();
	
});