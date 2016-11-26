angular.module('bankAccount.controllers')
.controller("newAccountController", function ($location, userService, $routeParams, $scope, formService) {
	var newAcc= this;

	newAcc.init= function() {
		newAcc.userId= $routeParams.userId;
		newAcc.tId= checktId(newAcc.userId);
		newAcc.newAccount= bindTransact(newAcc.tId);
		newAcc.info="";
		newAcc.updateInfo="";
	};//end, init function

	var checktId= function(userId) {
		if(userId==undefined){ //undefined Id= create account
			return 0;
		}else{ //defined id,edit account
			return 1;
		};
	};

	var bindTransact= function(tId) {
		if(tId==1){
			return userService.getCurrentUser();
		}else{
			formService.clearForm(newAccForm, $scope);
			return {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
		};
	};
	
	newAcc.validateCreate= function() {
		newAcc.info="";
		var newUser= newAcc.newAccount;
		var result= userService.createNewAccount(newUser);
		if(!result.error){//user created
			newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
			newAcc.info="Usuario creado con éxito";
			$location.path("/");
			newAcc.info="";
		}else{//error, user name already exists or passwords don't match.
			newAcc.info= result.string;
		};
	};

	//cancel create a new account
	newAcc.cancel= function() {
		newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
		newAcc.info="";
		$location.path("/");
	};

	newAcc.edit= function() {
		var user= newAcc.newAccount;
		user.userId= newAcc.userId;
		var result= userService.editAccount(user);
		if(!result.error){
			newAcc.updateInfo= result.string;
			userService.login(user);
			newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
			formService.clearForm(newAccForm, $scope);
			$location.path("profile/" + user.userId);
			newAcc.updateInfo="";
		}else{
			newAcc.updateInfo= result.string;
		};
	};




	newAcc.cancelEdit= function() {
		formService.clearForm(newAccForm, $scope);
		$location.path("/profile/" + newAcc.userId);
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

});

