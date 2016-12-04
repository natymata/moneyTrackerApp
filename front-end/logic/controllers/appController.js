angular.module('bankAccount.controllers')
.controller('appController', function($scope, userService, $location) {
	var appCtrl= this;

	//init values
	appCtrl.init= function() {
		$scope.isSignedIn= false;
		$scope.tab=1;
		isLoggedIn();		
	};//end init

	//set active class tab
	$scope.selectedTab= function(number) {
		$scope.tab= number;
	}//end function

	//checks if there's a session cookie and logs in the user.
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
	};//end isLoogedin

	//set sigInTrue var true
	$scope.sigInTrue= function() {
		$scope.isSignedIn= true;
	};//end

	//set sigInTrue var false
	$scope.sigInFalse= function() {
		$scope.isSignedIn= false;
	};//end

	appCtrl.init();
});