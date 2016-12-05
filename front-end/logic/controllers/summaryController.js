angular.module('bankAccount.controllers') 
.controller("summaryController", function(userService, $routeParams, transactService, $scope) {
	var summary= this;

	summary.init= function() {
		$scope.selectedTab(2);
		summary.isLoading= true;
		summary.error="";
		summary.userId= $routeParams.userId;
		summary.userName= userService.getCurrentUser().name;
		summary.accountType= userService.getCurrentUser().accountType;
		summary.money= userService.getCurrentUser().money;
		summary.welcome= "Bienvenid@" + " " + summary.userName;
		summary.displayElements= true;
		getTransactByUserId();
	};


	var getTransactByUserId= function() {
		transactService.getTransactByUserId(summary.userId)
		.success(function(response){
			if(!response.error){
				summary.userTransacts= transactService.setData(response.data);
				summary.showElements= showElements(summary.userTransacts);
				summary.balance= getBalance(summary.userTransacts);
				summary.isLoading= false;
			}else{
				summary.isLoading= false;
			};
		})
		.error(function(response){
			summary.isLoading= false;
			summary.displayElements= false;
			console.error(response.message);
			summary.error= "No se han encontrado datos del usuario, intente de nuevo";
		});
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

});
