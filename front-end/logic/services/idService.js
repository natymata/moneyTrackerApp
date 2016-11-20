angular.module('bankAccount.services')
.factory('idService', function($cookies, localStorageService) {

var setId= function(type) {
		var date, time, length, charset, val;

		date= new Date();
		time= date.getTime();
		length=4;
		charset= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		
		if(type=="user"){
			val= "usr" + time;
		}else{
			val= "trs" + time;
		}

		for (var i=0, n=charset.length; i<length; ++i){
	        val += charset.charAt(Math.floor(Math.random() * n));
	    };

	    return val;
	};



//access
	return{
		setId:setId
	};
});