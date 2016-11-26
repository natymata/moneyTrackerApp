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
            .when('/profile/:userId', {
                templateUrl: 'front-end/views/userProfile.html',
                controller: 'userProfileController',
                controllerAs: 'profile'
            })
            .when('/newaccount-edit/:userId', {
                templateUrl: 'front-end/views/newAccount.html',
                controller: 'newAccountController',
                controllerAs: 'newAcc'
            })
            .when('/summary/:userId', {
                templateUrl: 'front-end/views/summary.html',
                controller: 'summaryController',
                controllerAs:'summary'
            })
            .when('/detail/:transactId', {
                templateUrl: 'front-end/views/detail.html',
                controller: 'detailController',
                controllerAs: 'detail'
            })
            .when('/add/:userId', {
                templateUrl: 'front-end/views/add.html',
                controller: 'addController',
                controllerAs:'add'
            })
            .when('/transact-edit/:userId/:transactId', {
                templateUrl: 'front-end/views/add.html',
                controller: 'addController',
                controllerAs:'add'
            })
            .otherwise({redirectTo: '/'});
}])
.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});

angular.module('bankAccount.controllers', []);
angular.module('bankAccount.services', []);
angular.module('bankAccount.directives', []);
angular.module('bankAccount.filters', []);