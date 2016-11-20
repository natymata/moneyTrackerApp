angular.module('bankAccount.controllers')
.controller("logOutController", ['$scope', 'BDService', '$routeParams', function ($scope, BDService, $routeParams){

	var emptyUser={};

	$scope.logOut= BDService.userLogIn(emptyUser);
}]);