angular.module('bankAccount.controllers')
.controller("userProfileController", function ($location, userService, $timeout) {
	var profile= this;

	profile.init= function() {
		profile.userId= userService.getCurrentUser().userId;
		profile.name= userService.getCurrentUser().name +" "+ userService.getCurrentUser().lastName;
		profile.username= userService.getCurrentUser().username;
		profile.money= userService.getCurrentUser().money;
		profile.accountType= userService.getCurrentUser().accountType;
		profile.confirmModal= false;
		profile.deleteModal= false;
		profile.deleteInfo="";
	};

	profile.back= function() {
		$location.path("/summary/" + profile.userId);
	};

	profile.edit= function() {
		$location.path("/newaccount-edit/" + profile.userId);
	};

	profile.delete= function() {
		profile.confirmModal= true;
	};	

	profile.cancelDelete= function() {
		profile.confirmModal= false;
	};


	profile.deleteAccount= function() {
		userService.deleteAccount(profile.userId)
		.success(function(response){
			if(response.deleted){
				profile.deleteInfo= "Su cuenta de usuario ha sido eliminada";
				profile.deleteModal= true;
				modal(true);
			}else{
				profile.deleteInfo= "Error, no se ha podido ejecutar la operación";
				profile.deleteModal= true;
				modal(false);
			}
		})
		.error(function(response) {
			profile.deleteInfo= "Error, no se ha podido ejecutar la operación";
			profile.deleteModal= true;
			modal(false);
		})

		
	};

	var modal= function(result) {
		$timeout(function(){
			profile.deleteModal= false;
			if(result){
				userService.logout();
				$location.path("/");
			}else{
				profile.confirmModal= false;
			}
		}, 2000);	
	};



	profile.init();
});