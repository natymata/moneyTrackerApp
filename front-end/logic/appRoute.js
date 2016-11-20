angular.module("bankAccount", ['ngRoute', 'ngResource', 'ngCookies', 'bankAccount.controllers', 'bankAccount.services', 'bankAccount.filters', 'bankAccount.directives'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'front-end/views/home.html',
                controller: 'homeController',
                controllerAs: 'home'
            })
            .when('/newaccount', {
                templateUrl: 'front-end/views/newAccount.html',
                controller: 'newAccountController',
                controllerAs: 'newAcc'
            })
            .when('/summary/:accountId', {
                templateUrl: 'front-end/views/summary.html',
                controller: 'summaryController',
                controllerAs:'summary'
            })
            .when('/detail/trsId', {
                templateUrl: 'front-end/views/detail.html',
                controller: 'detailController',
                controllerAs: 'detail'
            })
            .when('/add/:accountId', {
                templateUrl: 'front-end/views/add.html',
                controller: 'addController',
                controllerAs:'add'
            })
            .otherwise({redirectTo: '/'});
}]);

angular.module('bankAccount.controllers', []);
angular.module('bankAccount.services', []);
angular.module('bankAccount.directives', []);
angular.module('bankAccount.filters', []);


