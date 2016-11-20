angular.module('bankAccount.controllers')
.controller('appController', function(userService, $cookies, $location) {
	var appCtrl= this;

	appCtrl.init= function() {
		//init appLoggedUser
		// appCtrl.ntAppLoggedUser={
		// 	userId: "",
		// 	userType: "",
		// 	name:"",
		// 	lastName:"",
		// 	username:"",
		// 	money:"", 
		// 	accountType:"",
		// 	isConnected: false
		// };

		// var user={
		// 	userId: 1,
		// 	name:"Naty",
		// 	lastName:"Mata",
		// 	username:"natymata",
		// 	money:"Colones", 
		// 	accountType:"Debit",
		// 	userType:2
		// };

		//remove();
		
		 // setCookie(user);
		// printCookie();
		isLoggedIn();
	};

	var isLoggedIn= function() {
		var userId, cookieUser;
		if(userService.isLoggedIn()){
			cookieUser= angular.fromJson($cookies.get('ntLoggedUser'));
			userService.login(cookieUser);
			userId= cookieUser.userId;
			$location.path("/summary/"+userId);
		}else{
			$location.path("/");
		}
	};


	var remove= function() {
		$cookies.remove('ntLoggedUser');
	};

	var setCookie= function (user) {
		localStorage.setItem('ntLoggedUser', angular.toJson(user));
		$cookies.put('ntLoggedUser', angular.toJson(user));
	};

	var printCookie= function () {
		var print= angular.fromJson($cookies.get('ntLoggedUser'));
		console.log(print);
	};

	
	appCtrl.init();
});