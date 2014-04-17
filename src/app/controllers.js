/******************************************
*
*  menuApp -- Main Controller
*
******************************************/

(function (angular) {
    'use strict';

    var ctrl = angular.module('menuApp.controllers', []);
    ctrl.controller('MyCtrl', ['Menu', 'MenuItem', '$scope', '$timeout', '$location', function (Menu, MenuItem, $scope, $timeout, $location) {

        // Intermal variables/methods

        var mytimeout,
            qsKeys,
            timeNow = new Date(),
            sortMenu = function (a, b) {
                var keyA = parseInt(a.cooktime.time, 10),
                    keyB = parseInt(b.cooktime.time, 10);

                return keyA - keyB;
            },
            createMenuItem = function (name, preptime, cooktime, resttime, finishtime) {
                var thisstart = new Date($scope.dinnertime - cooktime * 60 * 1000),
                    thisend = new Date($scope.dinnertime),
                    newItem = new MenuItem(name, thisstart.toLocaleTimeString(), thisend.toLocaleTimeString());

                newItem.setMenuTime('finishtime', finishtime, 0, 0);
                newItem.setMenuTime('resttime', resttime, 0, 0);
                newItem.setMenuTime('cooktime', cooktime, 0, 0);
                newItem.setMenuTime('preptime', preptime, 0, 0);

                $scope.testMenu.menuItems.push(newItem);
                $scope.testMenu.calcTimes();
                console.log($scope.testMenu);

                $scope.menu.push(newItem);
                calcTimes();
                console.log('$scope.testMenu', $scope.testMenu, '$scope.menu', $scope.menu);
            },
            resetMenuItemScope = function () {
                $scope.itemName = '';
                $scope.finishTime = null;
                $scope.restTime = null;
                $scope.cookTime = null;
                $scope.prepTime = null;
            },
            calcTimes = function () {
                var i, menuLength = $scope.menu.length, lastPrepTimeStart, thisMenuItemStart, thisSectionStart = 0, thisSectionEnd = 0;

                    $scope.menu.sort(sortMenu);

                    for (i = 0; i < menuLength; i++) {
                        thisMenuItemStart = 0;

                        if ($scope.menu[i].finishtime.time && $scope.menu[i].finishtime.time > 0) {
                            $scope.menu[i].setMenuTime('finishtime', $scope.menu[i].finishtime.time, $scope.dinnertime - $scope.menu[i].finishtime.time * 60 * 1000, $scope.dinnertime);
                        }

                        thisSectionEnd = 0;
                        if ($scope.menu[i].resttime.time && $scope.menu[i].resttime.time > 0) {
                            if ($scope.menu[i].finishtime.time && $scope.menu[i].finishtime.time > 0) {
                                thisSectionEnd = $scope.menu[i].finishtime.start;
                            } else {
                                thisSectionEnd = $scope.dinnertime;
                            }
                            $scope.menu[i].setMenuTime('resttime', $scope.menu[i].resttime.time, thisSectionEnd - $scope.menu[i].resttime.time * 60 * 1000, thisSectionEnd);
                        }

                        thisSectionEnd = 0;
                        if ($scope.menu[i].resttime.time && $scope.menu[i].resttime.time > 0) {
                            thisSectionEnd = $scope.menu[i].resttime.start;
                        } else if ($scope.menu[i].finishtime.time && $scope.menu[i].finishtime.time > 0) {
                            thisSectionEnd = $scope.menu[i].finishtime.start;
                        } else {
                            thisSectionEnd = $scope.dinnertime;
                        }

                        $scope.menu[i].setMenuTime('cooktime', $scope.menu[i].cooktime.time, thisSectionEnd - $scope.menu[i].cooktime.time * 60 * 1000, thisSectionEnd);

                        thisMenuItemStart = $scope.menu[i].cooktime.start;
                        lastPrepTimeStart = i > 0 ? $scope.menu[i - 1].preptime.start : 0;

                        $scope.menu[i].preptime.end = $scope.menu[i].cooktime.start < lastPrepTimeStart || lastPrepTimeStart === 0 ? $scope.menu[i].cooktime.start : lastPrepTimeStart;
                        $scope.menu[i].preptime.start = $scope.menu[i].preptime.end - $scope.menu[i].preptime.time * 60 * 1000;

                        thisMenuItemStart = $scope.menu[i].preptime.time > 0 ? $scope.menu[i].preptime.start : $scope.menu[i].cooktime.start;

                        $scope.menu[i].start = thisMenuItemStart;

                        if (thisMenuItemStart < $scope.starttime || $scope.starttime === 0) {
                            $scope.starttime = thisMenuItemStart;
                        }
                    }
                console.log(($scope.dinnertime - $scope.starttime) / 60000);
                $scope.menu.reverse();
            };


        // INIT APP
        $scope.currentTime = Date.parse(timeNow);

        $scope.myQs = $location.search();
        console.log('qs', $scope.myQs, Object.keys($scope.myQs).length);

        $scope.menu = [];
        $scope.testMenu = new Menu();

        $scope.starttime = 0;
        $scope.dinnertime = null;

        $scope.widthMultiplier = 1;

        if ($scope.dinnertime === null) {
            timeNow.setHours(18, 0, 0, 0);
            $scope.dinnertime = Date.parse(timeNow);
            $scope.testMenu.dinnertime = Date.parse(timeNow);
        }
        if (Object.keys($scope.myQs).length > 0) {
            qsKeys = Object.keys($scope.myQs);
            qsKeys.forEach(function(key, index) {
                var thisItemArr = $scope.myQs[key].split('|');
                createMenuItem.apply(null, thisItemArr);
            });
        }

        $scope.$watch('starttime', function (newValue, oldValue, scope) {
            $scope.widthMultiplier = 800 / (($scope.dinnertime - $scope.starttime) / 60000);
        });


        $scope.formatDate = function (timevalue) {
            var date = new Date(timevalue);
            function pad(s) {
                return (('' + s).length < 2 ? '0' : '') + s;
            }
            function fixHour(h) {
                return h === 0 ? '12' : h > 12 ? h - 12 : h;
            }
            var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds(), timeStr = [
            fixHour(h),
            pad(m),
            pad(s)
            ].join(':');
            return timeStr + ' ' + (h < 12 ? 'AM' : 'PM');
        };

        $scope.addMenuItem = function () {
            createMenuItem($scope.itemName, $scope.prepTime, $scope.cookTime, $scope.restTime, $scope.finishTime);
            resetMenuItemScope();
        };

        $scope.calcRight = function () {
            var i, totalPixels = 0, args = Array.prototype.slice.call(arguments);
            for (i = 0; i < args.length; i++) {
              totalPixels += parseInt(args[i], 10);
          }
          return totalPixels * $scope.widthMultiplier;
        };

        $scope.calcMargin = function (start, end) {
            return (start - end) / 60000 * $scope.widthMultiplier;
        };

        $scope.calcSegmentWidth = function (timeMinutes) {
            return timeMinutes * $scope.widthMultiplier - 2;
        };

        $scope.onTimeout = function () {
            var timeNow = new Date();
            $scope.currentTime = Date.parse(timeNow);
            mytimeout = $timeout($scope.onTimeout, 30000);
        };

        mytimeout = $timeout($scope.onTimeout, 30000);

        }
    ]);
}(angular));