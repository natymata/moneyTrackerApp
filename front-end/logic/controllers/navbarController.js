angular.module('bankAccount.controllers')
.controller('navbarController', function(userService) {
	var navbar= this;

	navbar.isLoggedIn= userService.isLoggedIn();

	// navbar.logOut= userService.logOut(ntAppLoggedUser);

});