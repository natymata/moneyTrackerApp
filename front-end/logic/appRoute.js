angular.module("bankAccount", ['ngRoute', 'dataBase', 'bankAccount.controllers'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'front-end/views/home.html',
                controller: 'homeController'
            })
            .when('/newaccount/:id', {
                templateUrl: 'front-end/views/newAccount.html',
                controller: 'newAccountController'
            })
            .when('/summary/:accountId', {
                templateUrl: 'front-end/views/summary.html',
                controller: 'summaryController'
            })
            .when('/detail/:accountId/:trsId', {
                templateUrl: 'front-end/views/detail.html',
                controller: 'detailController'
            })
            .when('/add/:accountId', {
                templateUrl: 'front-end/views/add.html',
                controller: 'addController'
            })
            .otherwise({redirectTo: '/home'});
}]);

angular.module('bankAccount.controllers', []);


