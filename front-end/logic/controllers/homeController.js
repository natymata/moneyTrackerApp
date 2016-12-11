angular.module('bankAccount.controllers') 
.controller("homeController", function ($location, userService, $scope, formService) {
	var home= this;

	//init values
	home.init=function() {
		$scope.selectedTab(1); //set active tab
		home.user= {username:"", pass:""};
		home.info="";
	}; //end

	//check if the login credentials are valid, and logs in the user
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
					formService.clearForm($scope.logInForm);
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
	};//end can log in

	home.init();

});