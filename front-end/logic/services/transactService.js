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

		if(transact.transactType=="Crédito" || transact.transactType=="Credito"){
			typeId= 1;
		}else if(transact.transactType=="Débito" || transact.transactType=="Debito"){
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
			transactType: transact.transactType,
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

	var setData= function(dataArr) {
		angular.forEach(dataArr, function(transact) {
			var date= transact.date;
			date= new Date();
			transact.date= date;

			transact.amount= Number(transact.amount);

			if(transact.typeId== "0"){
				transact.transactType="Débito";
			}else{
				transact.transactType= "Crédito";
			};

			if(transact.detail == ""){
				transact.detail = "No registrado";
			};

			if(transact.shop == ""){
				transact.shop = "No registrado";
			};
		});
		return dataArr[0];	
	};

	var deleteTransact= function(transactId) {
		var url= "back-end/index.php/transact/deleteTransact/" + transactId;
		var result= $http.delete(url);
		return result;
	};//end , deleteTransact


	var editTransact= function(transact, userId) {
		
	}; //end, editTransact




	//access
	return{
		addNew: addNew,
		getTransactByUserId: getTransactByUserId,
		getTransactById:getTransactById,
		deleteTransact: deleteTransact,
		editTransact: editTransact,
		setData:setData
	};
});