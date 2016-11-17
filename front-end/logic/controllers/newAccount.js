angular.module('bankAccount.controllers')
	.controller("newAccountController", ['$scope', 'BDService', '$routeParams', function ($scope, BDService, $routeParams) {

		$scope.accounts= BDService.getAll();

		$scope.newAccount={};
			/*account= {
				id: 1,
				name: 'Antony',
				lastName:'Perez',
				username: 'aperez',
				pass: 'jkl',
				repeatpass: 'jkl',
				money:'colones',
				type: 'Ahorros'
			};
		*/

		$scope.accountExists= function () {
			$scope.exists= BDService.getAll().filter(function (item) {
				return item.username== $scope.newAccount.username;
			});
			return $scope.exists;
		}; //fin function

		$scope.validate= function () {
			var exists= $scope.accountExists();
			if(exists.length==0){
				$scope.addAccount();
				$scope.clearForm();
				$scope.userError="Cuenta Registrada exitosamente, ahora puede ingresar al sistema";
			}else{
				$scope.userError= "El nombre de usuario ya existe, agregue otro";
			}

		};//fin function
		
		$scope.addAccount= function () {
			BDService.saveAccount($scope.newAccount);
			$scope.newAccount={};
			$scope.clearForm();
		};//fin function

		$scope.clearForm= function () {
			if ($scope.newAccForm) {
                    $scope.newAccForm.$setPristine();
                    $scope.newAccForm.$setUntouched();
            }
		}; //fin function

		$scope.edit= function () {

			BDService.deleteAccount($scope.getAccount());
			BDService.editAccount($scope.getAccount(), $scope.accountId);
			$scope.newAccount={};
			$scope.clearForm();
		};

		$scope.accountId= Number($routeParams.id);

		$scope.getAccount= function () {
			$scope.contact= BDService.getAll().filter(function (item) {
				return item.id== $scope.accountId;
			})
			return $scope.contact[0];
		};


}]);