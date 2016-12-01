angular.module('bankAccount.services')
.factory('transactService', function(idService, localStorageService, $http) {

	var addNew= function(transact, userId) {
		var newTransact={};
		var url= 'back-end/index.php/transact/saveTransaction';
		var result;
		
		newTransact= setTransactInfo(transact, userId);
		result= $http.post(url, newTransact);
		return result;
	};//end, transact function

	var setTransactInfo= function(transact, userId) {
		var id;
		var typeId=0;

		if(!transact.transactId){
			id= idService.setId("transact");
		}else{
			id= transact.transactId;
		};

		if(transact.type=="Crédito" || transact.type=="Credito"){
			typeId= 1;
		}else if(transact.type=="Débito" || transact.type=="Debito"){
			typeId= 0;
		}else{
			typeId= 2; //no se conoce el tipo--asegura error en el back end--
		}

		var transactInfo= {
			userId: userId,
			transactId:id,
			date: transact.date,
			amount:transact.amount,
			detail: transact.detail,
			shop: transact.shop,
			type: transact.type,
			typeId:typeId
		};
		return transactInfo;
	};//end. setTransactInfo

	var getTransactByUserId= function(userId) {
		var url= "back-end/index.php/transact/getTransactByUserId/" + userId;
		var result= $http.get(url);
		return result;
	};// end getTransactByUserId

	var getTransactById= function(transactId) {
		var url= "back-end/index.php/transact/getTransactById/" + transactId;
		var result= $http.get(url);
		return result;
	};


/*temporales*/
	var getAllTransact= function() {
		return localStorageService.getOrInit('ntAllTransact');
	};//end getAllTransact

	var deleteTransact= function(transactId) {
		var response={
			error:"",
			string:""
		};

		var allTransact= getAllTransact().filter(function(transact) {
			return transact.transactId!= transactId;
		});

		localStorageService.set('ntAllTransact', allTransact);

		if(transactExists(transactId)){
			response.string= "Error, la transacción no ha sido eliminada";
			response.error= true;
		}else{
			response.string= "Transacción eliminada exitosamente";
			response.error= false;
		};
		return response;
	};//end , deleteTransact

	var transactExists= function(transactId) {
		var allTransact= getAllTransact();
		if(allTransact.length==0){
			return false;  //ni existe ninguna transaccion previamente
		}else{
			var exists= allTransact.filter(function(item) {
				return item.transactId==transactId;
			});

			if(exists.length==0){
				return false; // la transaccion no existe
			}else{
				return true; // la transaccion si existe
			}
		};
	}; //end, accountExists

	var editTransact= function(transact, userId) {
		var transactId= transact.transactId;
		var response={
			error:"",
			string:""
		};
		var remove;
		var createNew;

		remove= deleteTransact(transactId);
		if(remove.error){
			response.string= "Error, la transacción no ha sido eliminada";
			response.error= true;
		}else{
			createNew= addNew(transact, userId);
			if(createNew.error){
				response.string= "Error, la transacción no ha sido editada";
				response.error= true;
				return response;
			}else{
				response.string= "Transacción editada exitosamente";
				response.error= false;
				return response;
			};
		};
	}; //end, editTransact




	//access
	return{
		addNew: addNew,
		getTransactByUserId: getTransactByUserId,
		getTransactById:getTransactById,
		deleteTransact: deleteTransact,
		editTransact: editTransact
	};
});