/******************************************
*
*  menuApp -- Main Directive
*
******************************************/
(function (angular) {

    var directives = angular.module('menuApp.directives', []);

    directives.directive("menuBar", function () {
        return {
			restrict: "E",
			template: '<div class="{{itemType}}timebar timesegment timebar" title="{{thisTitle}}" ng-class="{\'current\': currentTime >= thisStart && currentTime <= thisEnd }" ></div>',
			controller: function ($scope) {
                this.formattedDate = function (timeValue) {
					var datevalue = new Date(timeValue);
					return datevalue.toLocaleTimeString();
				};
				this.calcSegWidth = function (timeMinutes) {
					return (timeMinutes * $scope.multiplier) - 2;
				};
                this.makeTitle = function (start, end) {
					var thisTitle = this.formattedDate(start) + " - " + this.formattedDate(end);
					return thisTitle;
                };
                this.makeWidth = function (time) {
					var thisWidth = this.calcSegWidth(time, $scope.multiplier) + "px";
					return thisWidth;
                };
                this.makeRightPosition = function (type, myItem) {
                    var rightPosition = 0;
                    switch (type) {
                        case "preptime":
                            rightPosition = this.calcRight(myItem.finishtime.time, myItem.resttime.time, myItem.cooktime.time);
                            break;
                        case "cooktime":
                            rightPosition = this.calcRight(myItem.finishtime.time, myItem.resttime.time);
                            break;
                        case "resttime":
                            rightPosition = this.calcRight(myItem.finishtime.time);
                            break;
                        default:
                            rightPosition = 0;
                            break;
                    }
                    return rightPosition + "px";
                };
                this.calcRight = function() {
                    var i,
                        totalPixels = 0,
                        args = Array.prototype.slice.call(arguments);

                    for (i=0; i < args.length; i++) {
                        totalPixels += parseInt(args[i], 10);
                    }
                    return (totalPixels * $scope.multiplier);
                };
               this.makeRightMargin = function (myItem) {
					return (((myItem.cooktime.start - myItem.preptime.end) / 60000) * $scope.multiplier) + 'px';
				};
            },
			scope: {
				itemType: "@",
				myItem: "=",
                multiplier: "=",
                currentTime: "="
			},
            replace: true,
            link: function (scope, element, attrs, barCtrl) {
                var thisType = attrs.itemType + "time",
                    initBar = function () {
                        scope.thisStart = scope.myItem[thisType].start;
                        scope.thisEnd = scope.myItem[thisType].end;
                        scope.thisTime = scope.myItem[thisType].time;
                        scope.thisTitle = barCtrl.makeTitle(scope.thisStart, scope.thisEnd);
                        makeBar();
                    },
                    makeBar = function () {
                        var thisWidth = barCtrl.makeWidth(scope.thisTime),
                            rightPosition = barCtrl.makeRightPosition(thisType, scope.myItem),
                            rightMargin = thisType === 'preptime' ? barCtrl.makeRightMargin(scope.myItem) : '0;';

                        element.css({
                            'right': rightPosition,
                            'width' : thisWidth,
                            'margin-right' : rightMargin
                        });
                    };

                scope.$watch('multiplier', function(newValue, oldValue) {
                    if (newValue) {
                        makeBar();
                    }
                }, true);

				initBar();
            }
        };
    });

})(angular);