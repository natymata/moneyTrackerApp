angular.module('bankAccount.controllers')
.controller("addController", function ($location, $routeParams, transactService, $scope, $timeout) {
	var add= this;

	/*
	init values
	 */
	add.init= function() {
		add.isLoading= true;
		$scope.selectedTab(3); //set active class
		add.userId= $routeParams.userId; 
		add.transactId= $routeParams.transactId;
		add.tId= checkTid(add.transactId); //0 indicates this movement is being created, 1 means it's being edited.
		add.newTransat= {};
		bindTransact(add.tId, add.transactId); //init values to add.newTransact
		add.info=""; 
		add.editInfo="";
		add.showModal= false;
		add.editModal= false;
	};//end init

	/**
	 * init values to newTransact var.
	 * @param  tId
	 * @param  transactId
	 * @return {}
	 */
	var bindTransact= function(tId, transactId) {
		if(tId==1){
			transactService.getTransactById(transactId)
			.success(function(response){
				add.newTransat= transactService.setData(response.data);
				add.newTransat= add.newTransat[0];
				add.isLoading= false;
			})
			.error(function(response){
				add.isLoading= false;
				add.info= "No se ha podido completar la operación, intente de nuevo";
			});
		}else{
			add.isLoading= false;
			add.newTransat= {date: "", amount: "", detail: "", shop: "", transactType: ""};
		};
	};

	//start the correct operation after form submit.
	add.checkOper= function() {
		if(add.tId==0){
			add.addTransact();
		}else{
			add.edit();
		}
	}//end

	/**
	 * addTransact, register a new trasaction
	 */
	add.addTransact= function() {
		add.info="";
		var newTrnst= add.newTransat;
		var userId= add.userId;
		transactService.addNew(newTrnst, userId)
		.success(function(response){
			if(!response.error){
				add.showModal= true;
				add.info="Transacción creada con éxito";
				add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""};
			}else{
				console.error(response.message);
				add.info= "No se ha podido completar la operación";
			};
		})
		.error(function(response){
			console.error(response.message);
			add.info= "No se ha podido completar la operación";
		});
	};//end addTransact

	/**
	 * Edit an user trasaction
	 */
	add.edit= function() {
		add.info="";
		var transact= add.newTransat;
		transact= transactService.setTransactInfo(transact);
		transactService.editTransact(transact)
		.success(function(response){
			if(response.edited){
				add.editInfo= "Edición realizada con éxito";
				add.editModal= true;
				modal(true);
				add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""};
			}else{
				add.editInfo= "El elemento no ha sido editado";
				add.editModal= true;
				modal(false);
			}
		})
		.error(function(response){
			editInfo= "No se ha podido editar el elemento";
			add.editModal= true;
			modal(false);
		});
	};//end edit

	/**
	 * hide modal after timeout
	 */
	var modal= function(result) {
		$timeout(function(){
			add.editModal= false;
			if(result){
				$location.path("detail/" + add.transactId);
			};
		}, 2000);	
	};//end modal

	/**
	 * Check if there's a setted transact id.
	 * if 0 indicates this movement is being created, 1 means it's being edited.
	 * @return boolean
	 */
	var checkTid= function(transactId) {
		if(transactId==undefined){
			return 0;
		}else{
			return 1;
		}
	};//end checkTid

	//add more transactions
	add.addMore= function() {
		add.showModal= false;
		add.info="";
	};//end addMore
	
	//back to summary view
	add.back= function() {
		add.showModal= false;
		$location.path("/summary/" + add.userId);
		add.info="";
	};//end back

	add.init();

});