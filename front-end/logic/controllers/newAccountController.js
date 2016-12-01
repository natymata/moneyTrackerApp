angular.module('bankAccount.controllers')
.controller("newAccountController", function ($location, userService, $routeParams, $scope, formService, $timeout) {
	var newAcc= this;

	newAcc.init= function() {
		newAcc.userId= $routeParams.userId;
		newAcc.tId= checktId(newAcc.userId);
		newAcc.newAccount= bindTransact(newAcc.tId);
		newAcc.info="";
		newAcc.editInfo= "";
		newAcc.updateInfo="";
		newAcc.showModal= false;
		newAcc.modalInfo="";
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

	newAcc.checkOper= function() {
		if(newAcc.tId==0){
			newAcc.validateCreate();
		}else{
			newAcc.edit();
		}
	};
	
	newAcc.validateCreate= function() {
		newAcc.info="";
		var newUser= newAcc.newAccount;
		userService.createNewAccount(newUser)
		.success(function(response){
			if(response.created){
				newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
				newAcc.modalInfo="Usuario creado con éxito";
				newAcc.showModal= true;
				modal();
				formService.clearForm(newAccForm, $scope);
				newAcc.info="";
			}else{
				if(response.message== "Username is unavailable"){
					newAcc.info= "Nombre de usuario no disponible";
				}else if(response.message== "Passwords don't match"){
					newAcc.info= "Contraseñas no coinciden";
				}else{
					newAcc.info= "Error, no se ha podido completar la operación";
				}
			};
		})
		.error(function(response) {
			newAcc.info= "Error, no se ha podido completar la operación";
			console.error(response.message);
		});
	};

	var modal= function() {
		$timeout(function(){
			newAcc.showModal= false;
			newAcc.modalInfo="";
			$location.path("/");
		}, 2000);	
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
		userService.editAccount(user)
		.success(function(response) {
			if(!response.error){
				userService.login(user);
				newAcc.newAccount= {userId: "", userType: "", name:"", lastName:"", username:"", pass:"", repeatPass:"", money:"", accountType:""};
				formService.clearForm(newAccForm, $scope);
				newAcc.updateInfo= "Usuario editado con éxito";
				newAcc.showModal= true;
				editModal(user.userId);
			}else{
				newAcc.editInfo= response.message;
			};
		})
		.error(function(response) {
			newAcc.editInfo= "Error, no se ha podido completar la operación";
		});
	};

	var editModal= function(userId) {
		$timeout(function(){
			newAcc.showModal= false;
			newAcc.updateInfo="";
			$location.path("profile/" + userId);
		}, 2000);	
	};


	newAcc.cancelEdit= function() {
		formService.clearForm(newAccForm, $scope);
		$location.path("/profile/" + newAcc.userId);
	};


	newAcc.init();
});

