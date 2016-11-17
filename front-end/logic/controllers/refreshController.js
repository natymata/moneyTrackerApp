angular.module("bankAccount") 
.controller("refreshController", ['$scope', "$window", '$routeParams', 'BDService', function ($scope, $window, $routeParams, BDService) {
	//llevar al home cada vez que se reinicia la pagina
	window.onbeforeunload = function(){ 
  		window.setTimeout(function () { window.location = ('#/home'); }, 0);
  		onbeforeunload=null; 
  		//window.location = '#/home';
	};

}]);