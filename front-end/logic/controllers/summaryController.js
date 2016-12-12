angular.module('bankAccount.controllers') 
.controller("summaryController", function(userService, $routeParams, transactService, $scope, $location) {
	var summary= this;

	//init values
	summary.init= function() {
		$scope.selectedTab(2);
		summary.isLoading= true;
		//summary.quantity=10;
		summary.error="";
		summary.userId= $routeParams.userId;
		summary.userName= userService.getCurrentUser().name;
		summary.accountType= userService.getCurrentUser().accountType;
		accountType();
		summary.money= userService.getCurrentUser().money;
		summary.welcome= "Bienvenid@" + " " + summary.userName;
		summary.displayElements= true;
		getTransactByUserId();
	};//end

	//redirect to add.
	summary.toAdd= function() {
		var userId= userService.getCurrentUser().userId;
		$location.path("/add/"+userId);
	};//end


	//get all user transactions to display
	var getTransactByUserId= function() {
		transactService.getTransactByUserId(summary.userId)
		.success(function(response){
			if(!response.error){
				summary.userTransacts= transactService.setData(response.data);
				summary.showElements= showElements(summary.userTransacts);
				summary.showSelect= showSelect(summary.userTransacts);
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
	};//end

	//define if there's user transactions or not to display
	var showElements= function(userTransacts) {
		if(userTransacts.length>0){
			return true;
		}else{
			return false;
		}
	};//end, function

	//git the user account balance
	var getBalance= function(userTransacts) {
		var balance=0;
		var credits= getTotal(userTransacts, 1);
		var debits= getTotal(userTransacts, 0);
		balance= credits - debits;
		return balance;
	};//end

	//get the total credits or debits to set the account balance
	var getTotal= function (pList, type) {
		var total= 0;
		for(i=0; i<pList.length; i++) {
			if(pList[i].typeId==type){
				total+= pList[i].amount;
			}
		}
		return total;
	};//end

	//select account type to display he correct message
	var accountType= function() {
		if(summary.accountType=="ahorros"){
			summary.ahorros= true;
		}else{
			summary.corriente= true;
		}
	};//end

	var showSelect= function(userTransacts) {
		if(userTransacts.length>49){
			return true;
		}else{
			return false;
		}
	};

	summary.init();

});
