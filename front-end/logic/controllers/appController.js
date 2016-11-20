angular.module('bankAccount.controllers')
.controller('appController', function($scope, userService, $cookies, $location) {
	var appCtrl= this;

	appCtrl.init= function() {
		$scope.isSignedIn= false;
		isLoggedIn();		
	};

	var isLoggedIn= function() {
		var userId, cookieUser;
		if(userService.isLoggedIn()){
			cookieUser= angular.fromJson($cookies.get('ntLoggedUser'));
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