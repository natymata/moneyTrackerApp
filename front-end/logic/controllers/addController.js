angular.module('bankAccount.controllers')
.controller("addController", ['$location', '$routeParams', 'transactService', function ($location, $routeParams, transactService) {
	var add= this;

	add.init= function() {
		add.userId= $routeParams.userId;	
		add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""
		};
		add.tId= 0; //0 indicates this movement is being created, 1 means it's being edited
		add.info="";

	};

	add.addTransact= function() {
		add.info="";
		var newTrnst= add.newTransat;
		var userId= add.userId;
		var result= transactService.addNew(newTrnst, userId);
		if(!result.error){//transaction created
			add.info="Transacción creada con éxito";
			add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""
			};

		}else{ //error, couldn't create transaction	
			add.info= result.string;
		};
	};





//userId




	add.init();

	//add/:userId

	/*var loggedUser= BDService.getloggedUser();

	$scope.userId= loggedUser.id;

	$scope.newTransat={};
	// transact= {
	// 		id: 1,
	// 		date: 'Antony',
	// 		amount:'5000',
	// 		detail: 'compra de chunches',
	// 		shop: 'pequeño mundo',
	// 		type: 'debito',
	// 	};
	

	$scope.addTransact= function () {
		var transacIds= BDService.getTransactCount();
		$scope.newTransat.id= transacIds;
		loggedUser.transac.push($scope.newTransat);
		BDService.updateTransactCount();
		$scope.msj= "Movimiento agregado con éxito";
		clearForm();
		BDService.updateLoggedUser();
		$scope.newTransat={};
		//$window.location.href = ('#/detail/' + $scope.userId+'/' + $scope.newTransat.id );
	};

	var	clearForm= function () {
		if ($scope.addTransactForm) {
                $scope.addTransactForm.$setPristine();
                $scope.addTransactForm.$setUntouched();
        }
	}; //fin function

	var transactId= Number($routeParams.accountId); 

	$scope.tId= transactId;
	
	var loggedUser= BDService.getloggedUser();

	//Parseando el objeto usuario
	var objeto= angular.fromJson(loggedUser);
	
	//agregar metodo al usuario para aceder a las transacciones
	objeto.getTransact= function () {
		return objeto.transac;
	};

	var transactList= objeto.getTransact();

	var getNewTransat= function () {
		var result= transactList.filter(function (item) {
		return item.id== transactId;
		});

		if(transactId>0){
			result[0].date= new Date(result[0].date);
		}
		
		return result[0];
	};

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

}]);