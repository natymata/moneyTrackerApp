angular.module('bankAccount.services')
.factory('localStorageService', function() {

	//save an object at the local storage service
	var set= function(key, object) {
		localStorage.setItem(key, angular.toJson(object));
	};

	//get a list from local sotrage
	var getAll= function(key) {
		return angular.fromJson(localStorage.getItem(key));
	};

	//remove an object from local storage
	var remove= function(key) {
		localStorage.removeItem(key);
	};

	//returns an objetc or initialize it, if it's not.
	var getOrInit= function(key) {
		return angular.fromJson(localStorage.getItem(key)) || [];
	};

	//returns the object "key", if it doesn't exist initilize it with "array".
	var getOrSetArray= function(key, array) {
		return angular.fromJson(localStorage.getItem(key)) || localStorage.setItem(key, angular.toJson(array));
	};


	//access
	return{
		set: set,
		getAll: getAll,
		remove: remove,
		getOrInit:getOrInit,
		getOrSetArray:getOrSetArray
	}


});