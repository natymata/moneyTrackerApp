angular.module('bankAccount.services')
.factory('transactService', function(idService, localStorageService, $http) {

	//Register a new transaction into the database
	var addNew= function(transact, userId) {
		var newTransact={};
		var url= 'back-end/index.php/transact/saveTransaction';
		var result;
		
		newTransact= setTransactInfo(transact, userId);
		result= $http.post(url, newTransact);
		return result;
	};//end, transact function

	//create the new transact object to be sent to database
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
			transactType: transact.transactType,
			typeId:typeId
		};
		return transactInfo;
	};//end. setTransactInfo

	//get all user transactions by user id.
	var getTransactByUserId= function(userId) {
		var url= "back-end/index.php/transact/getTransactByUserId/" + userId;
		var result= $http.get(url);
		return result;
	};// end getTransactByUserId

	//get a transaction info by it's id
	var getTransactById= function(transactId) {
		var url= "back-end/index.php/transact/getTransactById/" + transactId;
		var result= $http.get(url);
		return result;
	};//end

	//set data types and info to the object vars returned as strings from database, to be used by angular and displayed to the user
	var setData= function(dataArr) {
		angular.forEach(dataArr, function(transact){
			// Split timestamp into [ Y, M, D, h, m, s ]
			var t = transact.date.split(/[- :]/);
			// Apply each element to the Date function
			transact.date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

			//Convert amount to valid number
			transact.amount= Number(transact.amount);

			//set typeId
			if(transact.typeId== "0"){
				transact.transactType="Débito";
			}else{
				transact.transactType= "Crédito";
			};
		});
		return dataArr;	
	};//end setData

	//delete a tranasaction by id
	var deleteTransact= function(transactId) {
		var url= "back-end/index.php/transact/deleteTransact/" + transactId;
		var result= $http.delete(url);
		return result;
	};//end , deleteTransact


	//edit a transaction by id
	var editTransact= function(transact) {
		var url= "back-end/index.php/transact/editTransact";
		var result= $http.post(url, transact);
		return result;
	}; //end, editTransact


	//access
	return{
		addNew: addNew,
		setTransactInfo:setTransactInfo,
		getTransactByUserId: getTransactByUserId,
		getTransactById:getTransactById,
		deleteTransact: deleteTransact,
		editTransact: editTransact,
		setData:setData
	};
});