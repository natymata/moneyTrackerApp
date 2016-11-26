angular.module('bankAccount.controllers')
.controller("userProfileController", function ($location, userService) {
	var profile= this;

	profile.init= function() {
		profile.userId= userService.getCurrentUser().userId;
		profile.name= userService.getCurrentUser().name +" "+ userService.getCurrentUser().lastName;
		profile.username= userService.getCurrentUser().username;
		profile.money= userService.getCurrentUser().money;
		profile.accountType= userService.getCurrentUser().accountType;
	};

	profile.back= function() {
		$location.path("/summary/" + profile.userId);
	};

	profile.edit= function() {
		$location.path("/newaccount-edit/" + profile.userId);
	};

	profile.init();
});