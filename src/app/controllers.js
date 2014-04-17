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
            resetMenuItemScope = function () {
                $scope.itemName = '';
                $scope.finishTime = null;
                $scope.restTime = null;
                $scope.cookTime = null;
                $scope.prepTime = null;
            };


        // INIT APP

        // Current time
        $scope.currentTime = Date.parse(timeNow);

        // Check query string
        $scope.myQs = $location.search();

        // create menu object
        $scope.testMenu = new Menu();

        // Default width multiplier
        $scope.widthMultiplier = 1;


        if ($scope.testMenu.dinnertime === null) {
            timeNow.setHours(18, 0, 0, 0);
            $scope.testMenu.dinnertime = Date.parse(timeNow);
        }

        if (Object.keys($scope.myQs).length > 0) {
            qsKeys = Object.keys($scope.myQs);
            qsKeys.forEach(function(key, index) {
                var thisItemArr = $scope.myQs[key].split('|');
                $scope.testMenu.createMenuItem.apply($scope.testMenu, thisItemArr);
            });
        }

        $scope.$watch('testMenu.starttime', function (newValue, oldValue, scope) {
            console.log('starttime change');
            $scope.widthMultiplier = 800 / (($scope.testMenu.dinnertime - $scope.testMenu.starttime) / 60000);
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
            $scope.testMenu.createMenuItem($scope.itemName, $scope.prepTime, $scope.cookTime, $scope.restTime, $scope.finishTime);
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

    }]);
}(angular));