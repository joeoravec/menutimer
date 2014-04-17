
(function (angular) {

    var directives = angular.module('menuApp.directives', []);

    directives.directive("menuBar", function () {
        return {
			restrict: "E",
			template: '<div class="{{itemType}}timebar timesegment" title="{{thisTitle}}" style="right: {{rightPosition}}  width: {{thisWidth}} margin-right: {{rightMargin}}"  ng-class="{\'current\': currentTime >= thisStart && currentTime <= thisEnd }" ></div>',
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
					var thisWidth = this.calcSegWidth(time, $scope.multiplier) + "px;";
					return thisWidth;
                };
                this.makeRightPosition = function (type, myItem) {
                    console.log(type);
                    console.log(myItem.finishtime.start);
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
                    console.log(rightPosition);
                    return rightPosition + "px;";
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
					return (((myItem.cooktime.start - myItem.preptime.end) / 60000) * $scope.multiplier) + 'px;';
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
               scope.$watch('multiplier', function(newValue, oldValue) {
					if (newValue) {
						makeBar();
					}
				}, true);

               var thisType = attrs.itemType + "time";
               // console.log(thisType);
               // scope.currentTimeFormatted = barCtrl.formattedDate(scope.currentTime);
               var init = function () {
                console.log(thisType);
					scope.thisStart = scope.myItem[thisType].start;
					scope.thisEnd = scope.myItem[thisType].end;
					scope.thisTime = scope.myItem[thisType].time;
					scope.thisTitle = barCtrl.makeTitle(scope.thisStart, scope.thisEnd);
					makeBar();
				};

				var makeBar = function () {
					scope.thisWidth = barCtrl.makeWidth(scope.thisTime);
					scope.rightPosition = barCtrl.makeRightPosition(thisType, scope.myItem);
					scope.rightMargin = thisType === 'preptime' ? barCtrl.makeRightMargin(scope.myItem) : '0;';
				};

				init();
            }
        };
    });

})(angular);