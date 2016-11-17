angular.module('BDServices')
	.service("BDService", function(){

		//todas las cuentas existentes en el local storage
		var accounts= angular.fromJson(localStorage.getItem("accounts")) || [];

		var indexOfLoggedUser;

		//Obtener todas las cuentas en la lista de cuentas
		var getAll= function(){
			return accounts;
		};

		//Persiste los cambios en la lista de cuentas.
		var updateStorage= function(){
			localStorage.setItem('accounts', JSON.stringify(accounts));
		};

		//Obtener el usuario logeado o iniciarlizarlo
		var loggedUser= angular.fromJson(localStorage.getItem("loggedUser")) || {};

		/*FUNCIONES DE ID*/

		//obtener el id que sigue para asignarlo a una nueva cuenta creada
		var getId= function () {
			var id= Number(localStorage.getItem("accountIdCount")) || 1;
			return id;
		};

		//actualizar el contador id de las cuentas despues de haber sido utilizado el anterior
		var updateId= function () {
			var newId= (getId())+1;
			localStorage.setItem("accountIdCount", newId);
		};

		//obtener el id que sigue de todas las transacciones realizadas.
		var getTransactCount = function () {
			var id= Number(localStorage.getItem("transactCount")) || 1;
			return id;
		};

		//actualizar el contador id de todas las transacciones realziadas
		var updateTransactCount= function () {
			var newId= (getTransactCount())+1;
			localStorage.setItem("transactCount", newId);
		};

		//FUNCIONES DE REGISTRO DE CUENTAS
		
		//Almacenar una nueva cuenta en la lista de cuentas
		var  saveAccount= function (accountObject) {
				accountObject.id= getId();
				accountObject.transac=[];
				accountObject.getTransact= function () {
					return accountObject.transac;
				}
				accounts.push(accountObject);
				updateStorage();
				updateId();
		};

		//Edita caracteristicas de registro de la cuenta
		var  editAccount= function (accountObject, pId) {
				accountObject.id= pId;
				accounts.push(accountObject);
				updateStorage();
		};

		//Elimina la cuenta
		var deleteAccount= function(account){
			var index= accounts.indexOf(account);
			accounts.splice(index, 1);
			updateStorage();
			return getAll();
		};

		/*FUNCIONES DE LOG IN*/

		//SET del usuario actual de la app DESDE EL LOG IN
		var userLogIn= function (accountObject) {
			loggedUser= accounts.filter(function (item) {
				indexOfLoggedUser= accounts.indexOf(accountObject);
				return item.id== accountObject.id;
			});
			setloggedUser();
		};

		//get del usuario actual de la app
		var getloggedUser= function () {
			return loggedUser[0];
		};

		//persiste el usuario loggeado en el local storage
		var setloggedUser= function(){
			localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
		};

		//Log out del usuario actual de la app
		var logOut= function () {
			loggedUser={};
			setloggedUser();
		};


		/*FUNCIONES DE EDICION DEL LA CUENTA -agregar movimientos, editarlos, etc*/

		//OJO!!Actualiza los movimientos en el usuario actual-- Despues de que se le han hecho cambios de movimientos o ediciones//
		var updateLoggedUser= function () {
			accounts.splice(indexOfLoggedUser, 1);
			accounts[indexOfLoggedUser]= getloggedUser();
			setloggedUser();
			updateStorage();
		};


		return{
			getAll: getAll,
			saveAccount: saveAccount,
			deleteAccount: deleteAccount,
			editAccount: editAccount,
			userLogIn:userLogIn,
			getloggedUser:getloggedUser,
			logOut:logOut,
			getTransactCount:getTransactCount,
			updateTransactCount:updateTransactCount,
			updateLoggedUser:updateLoggedUser
		}

});
