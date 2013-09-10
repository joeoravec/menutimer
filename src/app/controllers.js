// MAIN APP MODULE/CONTROLLERS

(function (angular) {

    var ctrl = angular.module('menuApp.controllers', []);

    ctrl.controller( 'MyCtrl', ['MenuItem', '$scope', '$timeout', '$location', function (MenuItem, $scope, $timeout, $location) {

    // An initial test to retrieve parameters from the querystring.
    $scope.myQs = $location.search();
    console.log($scope.myQs);

    // Add a service to handle menu
    $scope.menu = [];

    // This needs to be dynamic
    $scope.dinnertime = Date.parse("Fri, 06 Sep 2013 18:00:00");

    // Date formatting is (I think) specific to the presentation layer -- and can be moved into a directive
    $scope.formatDate = function (timevalue) {
        var date = new Date(timevalue);

        function pad(s) {
            return ((''+s).length < 2 ? '0' : '') + s;
        }
        function fixHour(h) {
            return ( h=== 0 ? '12' : (h > 12 ? h-12 : h) );
        }
        var h=date.getHours(),
            m=date.getMinutes(),
            s=date.getSeconds(),
            timeStr=[(fixHour(h)),
            pad(m),
            pad(s)].join(':');

        return timeStr + ' ' + (h < 12 ? 'AM' : 'PM');
    };


    $scope.addMenuItem = function () {
        var thisstart = new Date($scope.dinnertime - ($scope.cookTime * 60 * 1000)),
            thisend = new Date($scope.dinnertime),
            newItem = new MenuItem($scope.itemName, thisstart.toLocaleTimeString(), thisend.toLocaleTimeString());

        newItem.setMenuTime('finishtime', $scope.finishTime, 0, 0);
        newItem.setMenuTime('resttime', $scope.restTime, 0, 0);
        newItem.setMenuTime('cooktime', $scope.cookTime, 0, 0);
        newItem.setMenuTime('preptime', $scope.prepTime, 0, 0);

        $scope.menu.push(newItem);
        /*
        $scope.menu.push({
            'name': $scope.itemName,
            'finishtime': {
                'time': $scope.finishTime,
                'start': 0,
                'end': 0
            },
            'resttime': {
                'time': $scope.restTime,
                'start': 0,
                'end': 0
            },
            'cooktime': {
                'time': $scope.cookTime,
                'start': 0,
                'end': 0
            },
            'preptime': {
                'time': $scope.prepTime,
                'start': 0,
                'end': 0
            },
            'start': thisstart.toLocaleTimeString(),
            'done': thisend.toLocaleTimeString()
        });
        */
        calcTimes();

        // Add a function to 'reset' all of the values
        $scope.itemName = '';
    };

    var sortMenu = function (a, b) {
            var keyA = parseInt(a.cooktime.time, 10),
                keyB = parseInt(b.cooktime.time, 10);

            if (keyA < keyB) {
                return -1;
            }
            if (keyA > keyB) {
                return 1;
            }
            return 0;
        };

    var calcTimes = function () {
        /* The main calculations....
            - First, sort the array by cooktime, short to long
            - Then, for each, set start/end times (finish, rest, cook, prep) from dinnertime
            - Use previous menu item's prep time to make sure preps don't overlap
            - Finally, reverse the order of the array so it'll display longest on top
        */
        var i,
            menuLength = $scope.menu.length,
            lastPrepTimeStart,
            thisSectionStart = 0,
            thisSectionEnd = 0;

        $scope.menu.sort(sortMenu);

        for (i = 0; i < menuLength; i++) {
            // set finish time
            if (($scope.menu[i].finishtime.time) && ($scope.menu[i].finishtime.time > 0)) {
                $scope.menu[i].setMenuTime('finishtime', $scope.menu[i].finishtime.time, $scope.dinnertime - ($scope.menu[i].finishtime.time * 60 * 1000), $scope.dinnertime);
            }

            // set rest time
            thisSectionEnd = 0;
            if (($scope.menu[i].resttime.time) && ($scope.menu[i].resttime.time > 0)) {
                if (($scope.menu[i].finishtime.time) && ($scope.menu[i].finishtime.time > 0)) {
                    thisSectionEnd = $scope.menu[i].finishtime.start;
                } else {
                    thisSectionEnd = $scope.dinnertime;
                }
                $scope.menu[i].setMenuTime('resttime', $scope.menu[i].resttime.time, thisSectionEnd - ($scope.menu[i].resttime.time * 60 * 1000), thisSectionEnd);
            }

            // set cook time
            thisSectionEnd = 0;
            if (($scope.menu[i].resttime.time) && ($scope.menu[i].resttime.time > 0)) {
                thisSectionEnd = $scope.menu[i].resttime.start;
            } else if (($scope.menu[i].finishtime.time) && ($scope.menu[i].finishtime.time > 0)) {
                thisSectionEnd = $scope.menu[i].finishtime.start;
            } else {
                thisSectionEnd = $scope.dinnertime;
            }
            $scope.menu[i].setMenuTime('cooktime', $scope.menu[i].cooktime.time, thisSectionEnd - ($scope.menu[i].cooktime.time * 60 * 1000), thisSectionEnd);

            //set prep time
            lastPrepTimeStart = i > 0 ? $scope.menu[i - 1].preptime.start : 0;
            $scope.menu[i].preptime.end = ($scope.menu[i].cooktime.start < lastPrepTimeStart) || (lastPrepTimeStart === 0) ? $scope.menu[i].cooktime.start : lastPrepTimeStart;
            $scope.menu[i].preptime.start = $scope.menu[i].preptime.end - ($scope.menu[i].preptime.time * 60 * 1000);

        }
        $scope.menu.reverse();
    };


    // Should create a directive and include these two functions there
    // ----------
    
    $scope.calcRight = function() {
        var i,
            totalPixels = 0,
            args = Array.prototype.slice.call(arguments);
        for (i=0; i < args.length; i++) {
            totalPixels += parseInt(args[i], 10);
        }
        return totalPixels;
    };
    
    $scope.calcMargin = function (start, end) {
        return (start - end) / 60000;
    };

    // --------------
    
    // Set and update the current time
    // Currently refreshing every 30 seconds

    var timeNow = new Date();

    $scope.currentTime = Date.parse(timeNow);

    $scope.onTimeout = function(){
        var timeNow = new Date();
        $scope.currentTime = Date.parse(timeNow);
        mytimeout = $timeout($scope.onTimeout,30000);
    };

    var mytimeout = $timeout($scope.onTimeout,30000);
 }]);

})(angular);
