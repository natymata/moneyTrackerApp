angular.module('bankAccount.controllers')
.controller('navbarController', function(userService, $location, $scope) {
	var navbar= this;

	navbar.init=function() {
		navbar.userId= userService.getCurrentUser().userId;
	};

	navbar.logout= function() {
		userService.logout();
		$scope.sigInFalse();
		$location.path("/");
	};

	navbar.init();
	
});