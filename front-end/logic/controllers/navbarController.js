angular.module('bankAccount.controllers')
.controller('navbarController', function(userService, $location) {
	var navbar= this;

	navbar.isLoggedIn= userService.isLoggedIn();

	navbar.logout= function() {
		userService.logout();
		navbar.isLoggedIn= userService.isLoggedIn();
		$location.path("/");
	};
	

});