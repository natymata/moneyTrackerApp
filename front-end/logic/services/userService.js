angular.module('bankAccount.services')
.factory('userService', function($cookies, localStorageService, idService) {
	
	//Checks if there's a logged user after page refresh
	var isLoggedIn= function() {
		var user= $cookies.get('ntLoggedUser');
		if(user){
			return true;
		}else{
			return false;
		};
	};

	//logs in a user
	var login= function(ntAppLoggedUser, objUser) {
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

		console.log("login successfull");
	}; //end, login function

	
	//returns the object user from cookie store. object
	var getLoggedUser= function() {
		return angular.fromJson($cookies.get('ntLoggedUser'));
	}; //end, getUser function

	
	
	/*
	TEMP FUNCTIONS
	 */
	
	//verify by username if a account exists
	var accountExists= function(username) {
		var accountExists= getUsersLoginData().filter(function(item){
			return item.username== username;
		});

		if(accountExists!=[]){ //username si esta registrado
			return true;
		}else{
			return false; //username no registrado
		}
	}; //end, accountExists

	var createNewAccount= function(user) {
		var username= user.username,
			pass= user.pass;
			repeatPass= user.repeatPass;
		var	response={
				string:"",
				error:""
			};
		var newUser={};

		if(accountExists){
			response.string="Username ya registrado, escriba otro";
			response.error= true;
			return response;
		}else{
			if(pass==repeatPass){
				var newUser= setUserInfo(user);
				saveNewUser(newUser);
				saveUserPass(newUser.userId, newUser.username, pass);
				response.string="Usuario registrado con éxito";
				response.error= false;
				return response;
			}else{
				response.string="Passwords no coinciden";
				response.error= true;
				return response;
			}
		};
	

	}; //end, createNewAccount

	var setUserInfo= function(user) {
		var id= idService.setId("user");
		var accountInfo= {
			userId: id,
			userType: 2,
			name:user.name,
			lastName:user.lastName,
			username:user.username,
			money:user.money, 
			accountType:user.accountType
		};
		return accountInfo;
	};//end, setUserInfo

	var saveNewUser= function(user) {
		var allAccounts= getAllUsersAccounts();
		allAccounts.push(user);
		localStorageService.set('ntAllAccounts', allAccounts);
	};

	//returns all users account info
	var getAllUsersAccounts= function() {
		return localStorageService.getOrInit('ntAllAccounts');
	};

	//saves new users id and password at local storage
	var saveUserPass= function(id, username, pass) {
		var allUsers= getUsersLoginData();
		var newUser= {
			id: id,
			username: username,
			pass: pass
		};
		allUsers.push(newUser);
		localStorageService.set('ntUserPass', allUsers);
	}; //end, saveUserPass

	//returns an array containing all users id, username and password
	var getUsersLoginData= function() {
		return localStorageService.getOrInit('ntUserPass');
	};

	//verify user data, when trying to log in
	var canLogin= function(username, pass) {
		if(accountExists(username)){ //username si esta registrado
			if(userExists[0].pass==pass){ //password es correcto
				return true;
			}else{
				return false; //password incorrecto
			}
		}else{
			return false; //username no registrado
		}
	};//end, canLoging function

	var logout= function(ntAppLoggedUser) {
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

		return "Logout Successfull";
	};

	//returns a specific account identified by username
	var getUserByUserName= function(username) {
		var accounts= getAllUsersAccounts().filter(function(user) {
			return user.username== username;
		});
		return accounts[0];
	};//end, getUserByUserName

	var deleteAccount= function(userId, username) {
		var accounts,accountLogginData;
		var response={
			error:"",
			string:""
		};

		accounts= getAllUsersAccounts().filter(function(item) {
			return item.userId!=userId;
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

	var editAccount= function(user) {
		var userId= user.userId;
		var username= user.username;
		var deleteMsj;
		var createNewMsj;
		var response={
			error:"",
			string:""
		};

		deleteMsj= deleteAccount(userId, username);
		if(deleteMsj.error){
			response.string= "Error, la cuenta no ha sido editada";
			response.error= true;
			return response;
		}else{
			createNewMsj= createNewAccount(user);
			if(createNewMsj.error){
				response.string= "Error, la cuenta no ha sido editada";
				response.error= true;
				return response;	
			}else{
				response.string= "Cuenta editada exitosamente";
				response.error= false;
				return response;
			}
		}
	};

//access
	return{
		isLoggedIn:isLoggedIn,
		login:login,
		getLoggedUser:getLoggedUser,
		createNewAccount:createNewAccount,
		canLogin:canLogin,
		getUserByUserName:getUserByUserName,
		deleteAccount:deleteAccount,
		editAccount:editAccount
	};
});