(function (angular) {

	var services = angular.module('menuApp.services', []);

	services.factory('MenuItem', [function () {
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
})(angular);