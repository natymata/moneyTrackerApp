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

	detail.init();
	
/*
	$window.location.href = ('#/admin');
 */


});