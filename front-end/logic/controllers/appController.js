angular.module('bankAccount.controllers')
.controller('appController', function($scope, userService, $location) {
	var appCtrl= this;

	appCtrl.init= function() {
		$scope.isSignedIn= false;
		$scope.tab=1;
		isLoggedIn();		
	};

	$scope.selectedTab= function(number) {
		$scope.tab= number;
	}

	var isLoggedIn= function() {
		var userId, cookieUser;
		if(userService.isLoggedIn()){
			cookieUser= userService.getLoggedUser();
			userService.login(cookieUser);
			userId= cookieUser.userId;
			$scope.sigInTrue();
			$location.path("/summary/"+userId);
		}else{
			$location.path("/");
		}
	};

	$scope.sigInTrue= function() {
		$scope.isSignedIn= true;
	};

	$scope.sigInFalse= function() {
		$scope.isSignedIn= false;
	};

	appCtrl.init();
});