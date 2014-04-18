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
            if (time === null) { time = 0; }
			this[timeType] = {
				'time': time,
				'start': start,
				'end': end
			};
		};

		return MenuItem;
	}]);

    services.factory('Menu', ['MenuItem', function (MenuItem) {
        var Menu = function() {
            this.menuItems = [];
            this.starttime = 0;
            this.dinnertime = null;
        };

        Menu.prototype.calcTimes = function () {
            var i, menuLength = this.menuItems.length, lastPrepTimeStart, thisMenuItemStart, thisSectionStart = 0, thisSectionEnd = 0,
                sortMenu = function (a, b) {
                    var keyA = parseInt(a.cooktime.time, 10),
                        keyB = parseInt(b.cooktime.time, 10);

                    return keyA - keyB;
                };

                this.menuItems.sort(sortMenu);

                for (i = 0; i < menuLength; i++) {
                    thisMenuItemStart = 0;

                    if (this.menuItems[i].finishtime.time && this.menuItems[i].finishtime.time > 0) {
                        this.menuItems[i].setMenuTime('finishtime', this.menuItems[i].finishtime.time, this.dinnertime - this.menuItems[i].finishtime.time * 60 * 1000, this.dinnertime);
                    }

                    thisSectionEnd = 0;
                    if (this.menuItems[i].resttime.time && this.menuItems[i].resttime.time > 0) {
                        if (this.menuItems[i].finishtime.time && this.menuItems[i].finishtime.time > 0) {
                            thisSectionEnd = this.menuItems[i].finishtime.start;
                        } else {
                            thisSectionEnd = this.dinnertime;
                        }
                        this.menuItems[i].setMenuTime('resttime', this.menuItems[i].resttime.time, thisSectionEnd - this.menuItems[i].resttime.time * 60 * 1000, thisSectionEnd);
                    }

                    thisSectionEnd = 0;
                    if (this.menuItems[i].resttime.time && this.menuItems[i].resttime.time > 0) {
                        thisSectionEnd = this.menuItems[i].resttime.start;
                    } else if (this.menuItems[i].finishtime.time && this.menuItems[i].finishtime.time > 0) {
                        thisSectionEnd = this.menuItems[i].finishtime.start;
                    } else {
                        thisSectionEnd = this.dinnertime;
                    }

                    this.menuItems[i].setMenuTime('cooktime', this.menuItems[i].cooktime.time, thisSectionEnd - this.menuItems[i].cooktime.time * 60 * 1000, thisSectionEnd);

                    thisMenuItemStart = this.menuItems[i].cooktime.start;
                    lastPrepTimeStart = i > 0 ? this.menuItems[i - 1].preptime.start : 0;

                    this.menuItems[i].preptime.end = this.menuItems[i].cooktime.start < lastPrepTimeStart || lastPrepTimeStart === 0 ? this.menuItems[i].cooktime.start : lastPrepTimeStart;
                    this.menuItems[i].preptime.start = this.menuItems[i].preptime.end - this.menuItems[i].preptime.time * 60 * 1000;

                    thisMenuItemStart = this.menuItems[i].preptime.time > 0 ? this.menuItems[i].preptime.start : this.menuItems[i].cooktime.start;

                    this.menuItems[i].start = thisMenuItemStart;

                    if (thisMenuItemStart < this.starttime || this.starttime === 0) {
                        this.starttime = thisMenuItemStart;
                    }
                }
            this.menuItems.reverse();
        };

        Menu.prototype.createMenuItem = function (name, preptime, cooktime, resttime, finishtime) {
            var thisstart = new Date(this.dinnertime - cooktime * 60 * 1000),
                thisend = new Date(this.dinnertime),
                newItem = new MenuItem(name, thisstart.toLocaleTimeString(), thisend.toLocaleTimeString());

            newItem.setMenuTime('finishtime', finishtime, 0, 0);
            newItem.setMenuTime('resttime', resttime, 0, 0);
            newItem.setMenuTime('cooktime', cooktime, 0, 0);
            newItem.setMenuTime('preptime', preptime, 0, 0);

            this.menuItems.push(newItem);
            this.calcTimes();
        };

        return Menu;
    }]);
})(angular);