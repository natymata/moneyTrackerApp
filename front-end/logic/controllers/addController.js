angular.module('bankAccount.controllers')
.controller("addController", function ($location, $routeParams, transactService, $scope, $timeout) {
	var add= this;

	add.init= function() {
		add.userId= $routeParams.userId;	
		add.transactId= $routeParams.transactId;
		add.tId= checkTid(add.transactId); //0 indicates this movement is being created, 1 means it's being edited.
		add.newTransat= {};
		bindTransact(add.tId, add.transactId);
		add.info="";
		add.editInfo="";
		add.showModal= false;
		add.editModal= false;
	};

	var bindTransact= function(tId, transactId) {
		if(tId==1){
			transactService.getTransactById(transactId)
			.success(function(response){
				add.newTransat= transactService.setData(response.data);
			})
			.error(function(response){
				add.info= "No se ha podido completar la operación, intente de nuevo";
			});
		}else{
			add.newTransat= {date: "", amount: "", detail: "", shop: "", transactType: ""};
		};
	};

	add.addTransact= function() {
		add.info="";
		var newTrnst= add.newTransat;
		var userId= add.userId;
		transactService.addNew(newTrnst, userId)
		.success(function(response){
			if(!response.error){
				add.showModal= true;
				add.clear($scope.addTransactForm);
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
	};

	add.edit= function() {
		add.info="";
		var transact= add.newTransat;
		var userId= add.userId;
		var result= transactService.editTransact(transact, userId);
		if(!result.error){
			add.editInfo= "Edición realizada con éxito";
			add.editModal= true;
			modal(true);
			add.clear($scope.addTransactForm);
			add.newTransat={date: "", amount: "", detail: "", shop: "", type: ""
			};
		}else{
			editInfo= "No se ha podido editar el elemento";
			add.editModal= true;
			modal(false);
		};
	};

	var modal= function(result) {
		$timeout(function(){
			add.editModal= false;
			if(result){
				$location.path("detail/" + add.transactId);
			};
		}, 2000);	
	};

	var checkTid= function(transactId) {
		if(transactId==undefined){
			return 0;
		}else{
			return 1;
		}
	};

	add.clear= function(form) {
    	form.$setPristine();
    	form.$setUntouched();
	}; //end function

	add.addMore= function() {
		add.showModal= false;
		add.info="";
	};
	
	add.back= function() {
		add.showModal= false;
		$location.path("/summary/" + add.userId);
		add.info="";
	};

	add.init();

});