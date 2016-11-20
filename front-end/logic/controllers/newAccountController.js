angular.module('bankAccount.controllers')
.controller("newAccountController", ['$location', 'userService', function ($location, userService) {
	var newAcc= this;

	newAcc.init= function() {
		newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
		newAcc.info="";

	};	//end, init function
	
	newAcc.validateCreate= function() {
		newAcc.info="";
		var newUser= newAcc.newAccount;
		var result= userService.createNewAccount(newUser);
		console.log(result);
		if(!result.error){//se creo el usuario con éxito
			newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
			newAcc.info="Usuario creado con éxito";
			$location.path("/");
			newAcc.info="";
		}else{//error, nombre de usuario ya existía o passwords no coinciden
			newAcc.info= result.string;
		}
	};

	newAcc.cancel= function() {

	};

	

	
			

	newAcc.init();

///////////////////////////////////delete///////////////////////////////////
/*
	$scope.accountExists= function () {
		$scope.exists= BDService.getAll().filter(function (item) {
			return item.username== $scope.newAccount.username;
		});
		return $scope.exists;
	}; //fin function

	$scope.validate= function () {
		var exists= $scope.accountExists();
		if(exists.length==0){
			$scope.addAccount();
			$scope.clearForm();
			$scope.userError="Cuenta Registrada exitosamente, ahora puede ingresar al sistema";
		}else{
			$scope.userError= "El nombre de usuario ya existe, agregue otro";
		}

	};//fin function
	
	$scope.addAccount= function () {
		BDService.saveAccount($scope.newAccount);
		$scope.newAccount={};
		$scope.clearForm();
	};//fin function

	$scope.clearForm= function () {
		if ($scope.newAccForm) {
                $scope.newAccForm.$setPristine();
                $scope.newAccForm.$setUntouched();
        }
	}; //fin function

	$scope.edit= function () {

		BDService.deleteAccount($scope.getAccount());
		BDService.editAccount($scope.getAccount(), $scope.accountId);
		$scope.newAccount={};
		$scope.clearForm();
	};

	$scope.accountId= Number($routeParams.id);

	$scope.getAccount= function () {
		$scope.contact= BDService.getAll().filter(function (item) {
			return item.id== $scope.accountId;
		})
		return $scope.contact[0];
	};
*/
///////////////////////////////////delete///////////////////////////////////

}]);