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
			template: '<div class="timesegment timebar" ng-class="{\'current\': currentTime >= thisStart && currentTime <= thisEnd }" ></div>',
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
                    if (start === 0 || end === 0) { thisTitle = ""; }
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
                        console.log(scope.thisStart, scope.thisEnd, scope.thisTime);
                        makeBar();
                    },
                    makeBar = function () {
                        element.addClass(thisType + 'bar');
                        element.attr('title', barCtrl.makeTitle(scope.thisStart, scope.thisEnd));
                        element.css({
                            'right': barCtrl.makeRightPosition(thisType, scope.myItem),
                            'width' : barCtrl.makeWidth(scope.thisTime),
                            'margin-right' : thisType === 'preptime' ? barCtrl.makeRightMargin(scope.myItem) : '0;'
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