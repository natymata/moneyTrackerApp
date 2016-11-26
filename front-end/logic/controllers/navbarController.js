angular.module('bankAccount.controllers')
.controller('navbarController', function(userService, $location, $scope) {
	var navbar= this;

	navbar.logout= function() {
		var res= userService.logout();
		if(!res.error){ //user log out successfully
			$scope.sigInFalse();
			$location.path("/");
		}else{  //could'n log out user
			alert("No se ha podido deslogear el usuario, intente de nuevo");
		};
	};

	navbar.toProfile= function() {
		var userId= userService.getCurrentUser().userId;
		$location.path("/profile/"+userId);
	};

	navbar.toAdd= function() {
		var userId= userService.getCurrentUser().userId;
		$location.path("/add/"+userId);
	};

	navbar.toSummary= function() {
		var userId= userService.getCurrentUser().userId;
		$location.path("/summary/"+userId);
	};
	
});
