angular.module('bankAccount.controllers')
.controller("newAccountController", ['$location', 'userService', function ($location, userService) {
	var newAcc= this;

	newAcc.init= function() {
		newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
		newAcc.info="";

	};//end, init function
	
	newAcc.validateCreate= function() {
		newAcc.info="";
		var newUser= newAcc.newAccount;
		var result= userService.createNewAccount(newUser);
		if(!result.error){//user created
			newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
			newAcc.info="Usuario creado con éxito";
			$location.path("/");
			newAcc.info="";
		}else{//error, nombre de usuario ya existía o passwords no coinciden
			newAcc.info= result.string;
		}
	};

	newAcc.cancel= function() {
		newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
		newAcc.info="";
		$location.path("/");
	};

	newAcc.init();

///////////////////////////////////delete///////////////////////////////////
/*



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