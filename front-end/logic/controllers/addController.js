angular.module('bankAccount.controllers')
.controller("addController", function ($location, $routeParams, transactService, $scope) {
	var add= this;

	add.init= function() {
		add.userId= $routeParams.userId;	
		add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""
		};
		add.tId= 0; //0 indicates this movement is being created, 1 means it's being edited
		add.info="";
		add.showModal= false;
	};

	add.addTransact= function() {
		add.info="";
		var newTrnst= add.newTransat;
		var userId= add.userId;
		var result= transactService.addNew(newTrnst, userId);
		if(!result.error){//transaction created
			add.showModal= true;
			add.clear($scope.addTransactForm);
			add.info="Transacción creada con éxito";
			add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""
			};

		}else{ //error, couldn't create transaction	
			add.info= result.string;
		};
	};

	add.clear= function(form) {
    	form.$setPristine();
    	form.$setUntouched();
	}; //end function

	add.addMore= function() {
		add.showModal= false;
		add.info="";
	};
	
	add.back= function() {
		add.showModal= false;
		$location.path("/summary/" + add.userId);
		add.info="";
	};

	add.init();


/*
		var currentTransact= getNewTransat();

	$scope.newTransat = getNewTransat();

	$scope.edit= function () {
		var index= transactList.indexOf(currentTransact);
		transactList.splice(index, 1);
		transactList[index]=currentTransact;
		objeto.transac=[];
		objeto.transac=transactList;
		BDService.updateLoggedUser();
		$scope.newTransat={};
		$window.location.href = ('#/detail/' + $scope.userId+'/' + $scope.tId );
	};
	*/

});