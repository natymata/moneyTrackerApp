angular.module('bankAccount.controllers') 
.controller("homeController", ['$location','$routeParams', 'userService', function ($location, $routeParams, userService) {
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
				$location.path("/summary/" + currentUser.userId);
				home.info="";
			}else{
				home.info="No se ha podido efectuar la operación, intente de nuevo";
			};
		}else{
			home.info="Usuario o contraseña inválidos";
		};
	};






	home.init();


//////////////////////////////delete/////////////////////////////////////////

/*verifica si el usuario esta registrado y si el usuario y contraseña son correctos
	$scope.accountExists= function () {
		$scope.exists= BDService.getAll().filter(function (item) {
			return item.username== $scope.username;
		});
		return $scope.exists;
	}; //fin function

	$scope.canLogIn= function () {
		var saved= $scope.accountExists();
		var loggedUser;
		if(saved.length>0){
			if(saved[0].username==$scope.username){
				if(saved[0].pass==$scope.pass){
					BDService.userLogIn(saved[0]);
					loggedUser= BDService.getloggedUser();
					$scope.userError="";
					$scope.username="";
					$scope.pass="";
					$scope.clearForm();
					$window.location.href = ('#/summary/' + loggedUser.id);
				}else{
					$scope.userError= "Usuario o contraseña invalidos";
				}
			}
		}else{
			$scope.userError= "Usuario o contraseña invalidos";
		}
	};


	$scope.clearForm= function () {
			if ($scope.logInForm) {
                    $scope.logInForm.$setPristine();
                    $scope.logInForm.$setUntouched();
            }
	}; //fin function

*/

//////////////////////////////delete/////////////////////////////////////////

}]);

