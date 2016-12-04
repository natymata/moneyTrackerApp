angular.module('bankAccount.controllers') 
.controller("homeController", function ($location, userService, $scope, formService) {
	var home= this;

	home.init=function() {
		$scope.selectedTab(1);
		home.user= {username:"", pass:""};
		home.info="";
	}; 

	home.canLogIn= function() {
		var currentUser={};
		var result;
		userService.canLogin(home.user.username, home.user.pass)
		.success(function(response) {
			if(response.canLogin){
				currentUser= response.user;
				result= userService.login(currentUser);
				if(!result.error){
					$location.path("/summary/" + currentUser.userId);
					formService.clearForm(logInForm, $scope);
					home.info="Datos correctos, Bienvenido";
					home.user= {username:"", pass:""};
					$scope.sigInTrue();
					home.info="";
				}else{
					home.info="No se ha podido efectuar la operación, intente de nuevo";
					$scope.sigInFalse();
				};
			}else{
				home.info="Usuario o contraseña inválidos";
				$scope.sigInFalse();
			}
		})
		.error(function(response) {
			home.info= "Error, no se ha podido completar la operación";
			console.error(response.message);
		});		
	};

	home.init();

});