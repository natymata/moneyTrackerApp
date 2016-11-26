angular.module('bankAccount.controllers') 
.controller("homeController", function ($location, userService, $scope) {
	var home= this;

	home.init=function() {
		home.user= {username:"", pass:""};
		home.info="";
	}; 

	home.canLogIn= function() {
		var currentUser={};
		var result;
		if(userService.canLogin(home.user.username, home.user.pass)){
			currentUser= userService.getUserByUserName(home.user.username);
			result= userService.login(currentUser);
			if(!result.error){
				home.info="Datos correctos, Bienvenido";
				home.user= {username:"", pass:""};
				$scope.sigInTrue();
				$location.path("/summary/" + currentUser.userId);
				home.info="";
			}else{
				home.info="No se ha podido efectuar la operación, intente de nuevo";
				$scope.sigInFalse();
			};
		}else{
			home.info="Usuario o contraseña inválidos";
			$scope.sigInFalse();
		};
	};

	home.init();

});