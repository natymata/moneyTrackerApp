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
	};


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

	
	//verify by username if a account exists
	var accountExists= function(username) {
		var accounts= getUsersLoginData();
		if(accounts.length==0){
			return false;  //ni existe ninguna cuenta previamente
		}else{
			var exists= accounts.filter(function(item) {
				return item.username==username;
			});

			if(exists.length==0){
				return false; // la cuenta no existe
			}else{
				return true; // la cuenta si existe
			}
		};
	}; //end, accountExists

	var canUseUsername= function(username, userId) {
		if(accountExists(username)){
			var accounts= getUsersLoginData().filter(function(item) {
				return item.userId== userId;
			});
			if(accounts[0].username== username){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}

	};//end, canUseUsername


	var createNewAccount= function(user) {
		var username= user.username,
			pass= user.pass;
			repeatPass= user.repeatPass;
		var	response={
				string:"",
				error:""
			};
		var newUser={};

		if(accountExists(username)){
			response.string="Nombre de usuario ya registrado";
			response.error= true;
			return response;
		}else{
			if(pass==repeatPass){
				newUser= setUserInfo(user);
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
			userId: id,
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

	


	/*
	var canLogin= function(username, pass) {
		if(accountExists(username)){ //username si esta registrado

			var account= getUsersLoginData().filter(function(item) {
				return item.username==username;
			});

			if(account[0].pass==pass){ //password es correcto
				return true;
			}else{
				return false; //password incorrecto
			}
		}else{
			return false; //username no registrado
		}
	};//end, canLoging function
	 */

	//logout user
	var logout= function() {
		var response={
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
			response.error= true;
			response.msg="Error, no se ha podido deslogear el usuario";
			return response;
		}else{
			response.error= false;
			response.msg="Usuario deslogeado con éxito";
			return response;
		};
	};

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

	var editAccount= function(user) {
		var userId= user.userId;
		var username= user.username;
		var deleteMsj;
		var createNewMsj;
		var response={
			error:"",
			string:""
		};

		if(user.pass==user.repeatPass){
			if(canUseUsername(username, userId)){
				deleteMsj= deleteAccount(userId, username);
				response.deleteRes= deleteMsj.string;
				if(deleteMsj.error){
					response.string= "Error, la cuenta no ha sido eliminada";
					response.error= true;
					response.deleteRes= deleteMsj.string;
					return response;
				}else{
					createNewMsj= createNewAccount(user);
					response.createRes= createNewMsj.string;
					if(createNewMsj.error){
						response.string= "Error, la cuenta no ha sido editada";
						response.error= true;
						response.createRes= createNewMsj.string;
						return response;	
					}else{
						response.string= "Cuenta editada exitosamente";
						response.error= false;
						return response;
					}
				}
			}else{
				response.string= "Error, Nombre de usuario ya registrado, escriba otro";
				response.error= true;
				return response;
			}
		}else{
			response.string= "Error, passwords no coinciden";
			response.error= true;
			return response;
		}

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