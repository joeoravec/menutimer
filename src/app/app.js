
var menuApp = angular.module('menuApp', [
	'menuApp.services',
	'menuApp.controllers',
    'menuApp.directives'
  ]);

menuApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.otherwise( '/' );
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);