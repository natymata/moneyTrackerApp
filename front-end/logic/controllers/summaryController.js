angular.module('bankAccount.controllers') 
.controller("summaryController", function(userService, $routeParams, transactService) {
	var summary= this;

	summary.init= function() {
		summary.error="";
		summary.userId= $routeParams.userId;
		summary.userName= userService.getCurrentUser().name;
		summary.accountType= userService.getCurrentUser().accountType;
		summary.money= userService.getCurrentUser().money;
		summary.welcome= "Bienvenid@" + " " + summary.userName;

		transactService.getTransactByUserId(summary.userId)
		.success(function(response){
			if(!response.error){
				summary.userTransacts= setDataTypes(response.data);
				summary.showElements= showElements(summary.userTransacts);
				summary.balance= getBalance(summary.userTransacts);
			}else{
				summary.error= "No se han encontrado datos del usuario";
			}
		})
		.error(function(response){
			console.log(response.message);
			console.log(response);
			summary.error= "No se han encontrado datos del usuario";
		});
	};

	var setDataTypes= function(dataArr) {
	 	angular.forEach(dataArr, function(transact) {
			var date= transact.date;
			date= new Date();
			transact.date= date;
		});

		angular.forEach(dataArr, function(transact) {
			transact.amount= Number(transact.amount); 
		});

		angular.forEach(dataArr, function(transact) {
			if(transact.typeId=="0"){
				transact.transactType="Débito";
			}else{
				transact.transactType= "Crédito";
			};
		});

		return dataArr;
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
