angular.module('bankAccount.services')
.factory('userService', function($cookies, localStorageService, idService, $q, $http) {
	
	//saves logged user
	var ntAppLoggedUser={ userId: "", userType: "", name:"", lastName:"", username:"", money:"", accountType:"", isConnected: false };
			
	//Checks if there's a logged user after page refresh
	var isLoggedIn= function() {
		var user= $cookies.get('ntLoggedUser');
		if(user){
			return true;
		}else{
			return false;
		};
	};

	//verify user data, when trying to log in
	var canLogin= function(username, pass) {
		var user= {"username": username, "pass": pass};
		var url= 'back-end/index.php/user/login';
		result= $http.post(url, user);
		return result;
	};//end, canLoging function

	//logs in a user
	var login= function(objUser) {
		var response={
			msj:"",
			error:""
		};
		//set global app user
		ntAppLoggedUser.userId= objUser.userId,
		ntAppLoggedUser.userType= objUser.userType,
		ntAppLoggedUser.name= objUser.name,
		ntAppLoggedUser.lastName= objUser.lastName,
		ntAppLoggedUser.username= objUser.username,
		ntAppLoggedUser.money= objUser.money, 
		ntAppLoggedUser.accountType= objUser.accountType,
		ntAppLoggedUser.isConnected= true;

		//set localStorage var
		var local={
			userId: objUser.userId,
			userType: objUser.userType,
			name: objUser.name,
			lastName: objUser.lastName,
			username: objUser.username
		};
		localStorageService.set('ntAppLoggedUser', local);

		//set user cookie
		$cookies.put('ntLoggedUser', angular.toJson(objUser));

		if(isLoggedIn()){
			response.error= false;
			response.mjs="Usuario logeado con éxito";
			return response;
		}else{
			response.error= true;
			response.mjs="No se ha podido logear el usuario";
			return response;
		};
	}; //end, login function

	
	//returns the object user from cookie store. object
	var getLoggedUser= function() {
		return angular.fromJson($cookies.get('ntLoggedUser'));
	}; //end, getUser function

	//returns var ntAppLoggedUser
	var getCurrentUser= function() {  
		return ntAppLoggedUser;
	};//end, getCurrentUser

	var createNewAccount= function(user) {
		var newUser={};
		var url= 'back-end/index.php/user/registerUser';
		var result;

		newUser= setUserInfo(user);
		result= $http.post(url, newUser);
		return result;

	}; //end, createNewAccount

	var setUserInfo= function(user) {
		var id;

		if(!user.userId){
			id= idService.setId("user");
		}else{
			id= user.userId;
		};

		var accountInfo= {
			userId: id,
			userType: 2,
			name:user.name,
			lastName:user.lastName,
			username:user.username,
			money:user.money, 
			accountType:user.accountType,
			repeatPass: user.repeatPass,
			pass: user.pass
		};
		return accountInfo;
	};//end, setUserInfo

	//Edit an user account
	var editAccount= function(user) {
		var url= 'back-end/index.php/user/editUser';
		var result;

		result= $http.post(url, user);
		return result;
	};//end editAccount


	//logout user
	var logout= function() {
		var result={
			msg:"",
			error:""
		};

		ntAppLoggedUser.userId=  "";
		ntAppLoggedUser.userType= "";
		ntAppLoggedUser.name= "";
		ntAppLoggedUser.lastName= "";
		ntAppLoggedUser.username= "";
		ntAppLoggedUser.money= "" ;
		ntAppLoggedUser.accountType= "";
		ntAppLoggedUser.isConnected= false;

		//remove localstorage var
		localStorageService.remove('ntAppLoggedUser');
		$cookies.remove('ntLoggedUser');

		if(isLoggedIn()){
			result.error= true;
			result.msg="Error, no se ha podido deslogear el usuario";
			return result;
		}else{
			result.error= false;
			result.msg="Usuario deslogeado con éxito";
			backLogout()
			.success(function(response) {
				if(response.error){
					result.back= response.message;
				}else{
					result.back= response.message;	
				}
			})
			.error(function(response) {
				result.back= "No se ha podido realizar la operación";
			})
			return result;
		};
	};//end. logout

	var backLogout= function() {
		var url= 'back-end/index.php/user/logout';
		var result= $http.get(url);
		return result;
	}; //end, backLogout


	/*
	TEMP FUNCTIONS
	 */
	

	//returns a specific account identified by username
	var getUserByUserName= function(username) {
		var accounts= getAllUsersAccounts().filter(function(user) {
			return user.username== username;
		});
		return accounts[0];
	};//end, getUserByUserName

	
	// //verify by username if a account exists
	// var accountExists= function(username) {
	// 	var accounts= getUsersLoginData();
	// 	if(accounts.length==0){
	// 		return false;  //ni existe ninguna cuenta previamente
	// 	}else{
	// 		var exists= accounts.filter(function(item) {
	// 			return item.username==username;
	// 		});

	// 		if(exists.length==0){
	// 			return false; // la cuenta no existe
	// 		}else{
	// 			return true; // la cuenta si existe
	// 		}
	// 	};
	// }; //end, accountExists

	// var canUseUsername= function(username, userId) {
	// 	if(accountExists(username)){
	// 		var accounts= getUsersLoginData().filter(function(item) {
	// 			return item.userId== userId;
	// 		});
	// 		if(accounts[0].username== username){
	// 			return true;
	// 		}else{
	// 			return false;
	// 		}
	// 	}else{
	// 		return true;
	// 	}

	// };//end, canUseUsername

	// var saveNewUser= function(user) {
	// 	var allAccounts= getAllUsersAccounts();
	// 	allAccounts.push(user);
	// 	localStorageService.set('ntAllAccounts', allAccounts);
	// };

	// //returns all users account info
	// var getAllUsersAccounts= function() {
	// 	return localStorageService.getOrInit('ntAllAccounts');
	// };

	// //saves new users id and password at local storage
	// var saveUserPass= function(id, username, pass) {
	// 	var allUsers= getUsersLoginData();
	// 	var newUser= {
	// 		userId: id,
	// 		username: username,
	// 		pass: pass
	// 	};
	// 	allUsers.push(newUser);
	// 	localStorageService.set('ntUserPass', allUsers);
	// }; //end, saveUserPass

	// //returns an array containing all users id, username and password
	// var getUsersLoginData= function() {
	// 	return localStorageService.getOrInit('ntUserPass');
	// };

	




	var deleteAccount= function(userId, username) {
		var accounts, accountLogginData;
		var response={
			error:"",
			string:""
		};

		accounts= getAllUsersAccounts().filter(function(item) {
			return item.userId != userId;
		});
		localStorageService.set('ntAllAccounts', accounts);

		accountLogginData= getUsersLoginData().filter(function(aclItem){
			return aclItem.userId!= userId;
		});
		localStorageService.set('ntUserPass', accountLogginData);

		if(accountExists(username)){
			response.string= "Error, la cuenta no ha sido eliminada";
			response.error= true;
		}else{
			response.string= "Cuenta eliminada exitosamente";
			response.error= false;
		}
		return response;
	};


//access
	return{
		getCurrentUser:getCurrentUser, 
		isLoggedIn:isLoggedIn, 
		login:login,  
		getLoggedUser:getLoggedUser, 
		createNewAccount:createNewAccount,
		canLogin:canLogin, 
		getUserByUserName:getUserByUserName,
		deleteAccount:deleteAccount,
		editAccount:editAccount,
		logout:logout
	};
});