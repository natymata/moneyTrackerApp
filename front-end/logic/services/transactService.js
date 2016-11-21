angular.module('bankAccount.services')
.factory('transactService', function(idService, localStorageService) {

	var addNew= function(transact, userId) {
		var	response={
				string:"",
				error:""
			};
		var newTransact={};

		if(transact && userId){
			var newTransact= setTransactInfo(transact, userId);
			saveNewTransact(newTransact);
			if(transactExists(newTransact.transactId)){
				response.string="Movimiento registrado con éxito";
				response.error= false;
				return response;
			}else{
				response.string="No se ha podido registrar el movimiento";
				response.error= true;
				return response;
			};
		}else{
			response.string="No se ha podido registrar el movimiento";
			response.error= true;
			return response;
		};
	};//end, transact function

	var setTransactInfo= function(transact, userId) {
		var id= idService.setId("transact");
		var typeId=0;

		if(transact.type=="credit"){
			typeId= 1;
		}else if(transact.type=="debit"){
			typeId= 0;
		}else{
			typeId="unknown";
		}

		var transactInfo= {
			transactId:id,
			date: transact.date,
			amount:transact.amount,
			detail: transact.detail,
			shop: transact.shop,
			type: transact.type,
			typeId:typeId,
			userId: userId
		};
		return transactInfo;
	};//end. setTransactInfo

	var saveNewTransact= function(transact) {
		var allTransact= getAllTransact();
		allTransact.push(transact);
		localStorageService.set('ntAllTransact', allTransact);
	};//end saveNewTransact

	var getAllTransact= function() {
		return localStorageService.getOrInit('ntAllTransact');
	};//end getAllTransact

	var getTransactByUserId= function(userId) {
		var allTransact= getAllTransact().filter(function(transact) {
			return transact.userId==userId;
		});
		return allTransact;
	};// end getTransactByUserId

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
		deleteTransact: deleteTransact,
		editTransact: editTransact
	};
});