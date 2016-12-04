angular.module('bankAccount.controllers')
.controller("userProfileController", function ($location, userService, $timeout, $scope) {
	var profile= this;

	//init values
	profile.init= function() {
		$scope.selectedTab(4);
		profile.userId= userService.getCurrentUser().userId;
		profile.name= userService.getCurrentUser().name +" "+ userService.getCurrentUser().lastName;
		profile.username= userService.getCurrentUser().username;
		profile.money= userService.getCurrentUser().money;
		profile.accountType= userService.getCurrentUser().accountType;
		profile.confirmModal= false;
		profile.deleteModal= false;
		profile.deleteInfo="";
	};//end init

	//redirect to summary
	profile.back= function() {
		$location.path("/summary/" + profile.userId);
	};//end

	//redirect to newAccount-edit
	profile.edit= function() {
		$location.path("/newaccount-edit/" + profile.userId);
	};//end

	//shows delete confirm modal
	profile.delete= function() {
		profile.confirmModal= true;
	};//end

	//hides delete confirm modal
	profile.cancelDelete= function() {
		profile.confirmModal= false;
	};//end


	//edletes an user account
	profile.deleteAccount= function() {
		userService.deleteAccount(profile.userId)
		.success(function(response){
			if(response.deleted){
				profile.deleteInfo= "Su cuenta de usuario ha sido eliminada";
				profile.deleteModal= true;
				logout();
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
		});
	};

	//log out the user
	var logout= function() {
		var res= userService.logout();
		if(!res.error){ //user log out successfully
			$scope.sigInFalse();
			$location.path("/");
		}else{  //could'n log out user
			alert("No se ha podido deslogear el usuario, intente de nuevo");
		};
	};//end function

	//hides delte modal anr redirect acordint to function result.
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
	};//end

	profile.init();
});