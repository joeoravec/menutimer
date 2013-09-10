/*angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ui.state',
  'ui.route'
])

.config( function menuAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run ( titleService ) {
  titleService.setSuffix( ' | ngBoilerplate' );
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
	$scope.some = "no";

});

*/


var menuApp = angular.module('menuApp', [
	'menuApp.services',
	'menuApp.controllers'
  ]);

menuApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.otherwise( '/' );
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

// A test controller from the boilerplate code
menuApp.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
	$scope.some = "no";
});
/*
menuApp.factory('MenuItem', [function () {
    var MenuItem = function(name, start, end) {
		this.name = name;
		this.finishtime = this.resttime = this.cooktime = this.preptime = {
			'time': 0,
			'start': 0,
			'end': 0
		};
		this.start = start;
		this.done = end;
	};

	MenuItem.prototype.setMenuTime = function (timeType, time, start, end) {
		this[timeType] = {
			'time': time,
			'start': start,
			'end': end
		};
	};

	return MenuItem;
}]);
*/
