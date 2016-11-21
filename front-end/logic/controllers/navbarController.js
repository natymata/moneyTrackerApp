angular.module('bankAccount.controllers')
.controller('navbarController', function(userService, $location, $scope) {
	var navbar= this;

	navbar.init=function() {
		navbar.userId= userService.getCurrentUser().userId;
		console.log(navbar.userId);
		console.log("navbar initin");
	};

	navbar.logout= function() {
		userService.logout();
		$scope.sigInFalse();
		$location.path("/");
	};

	navbar.init();
	
});