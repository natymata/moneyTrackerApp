angular.module('bankAccount.controllers') 
.controller("homeController", ['$scope', '$window', 'BDService', '$routeParams', function ($scope, $window, BDService, $routeParams) {

/*trae todas las cuentas de la base de datos*/
	$scope.accounts= BDService.getAll();

/*verifica si el usuario esta registrado y si el usuario y contraseña son correctos*/
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


}]);

