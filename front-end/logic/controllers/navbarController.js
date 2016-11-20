angular.module('bankAccount.controllers')
.controller('navbarController', function(userService, $location, $scope) {
	var navbar= this;

	navbar.logout= function() {
		userService.logout();
		$scope.sigInFalse();
		$location.path("/");
	};
	
});