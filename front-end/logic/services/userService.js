angular.module('bankAccount.services')
.factory('userService', function($cookies, localStorageService, idService, $http) {
	
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
	};//end

	//verify user credentials, when trying to log in
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

	//creates a new user account
	var createNewAccount= function(user) {
		var newUser={};
		var url= 'back-end/index.php/user/registerUser';
		var result;

		newUser= setUserInfo(user);
		result= $http.post(url, newUser);
		return result;
	}; //end, createNewAccount

	//create the new user object to be sent to database. sets all vars
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


	//logout user. front-end side
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

	//back end log out
	var backLogout= function() {
		var url= 'back-end/index.php/user/logout';
		var result= $http.get(url);
		return result;
	}; //end, backLogout

	//delete an user account
	var deleteAccount= function(userId) {
		var url= "back-end/index.php/user/deleteUser/" + userId;
		var result= $http.delete(url);
		return result;
	};//end
	
	
//access
	return{
		getCurrentUser:getCurrentUser, 
		isLoggedIn:isLoggedIn, 
		login:login,  
		getLoggedUser:getLoggedUser,
		createNewAccount:createNewAccount,
		canLogin:canLogin, 
		deleteAccount:deleteAccount,
		editAccount:editAccount,
		logout:logout
	};
});