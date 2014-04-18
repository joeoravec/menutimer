describe( 'directives tests' , function() {

    var element, scope, compile, defaultData, validTemplate = '<menu-bar></menu-bar>';

    function createDirective(data, template) {
        var elm;

        scope = data || defaultData;
        template = angular.element(template);

        elm = compile(template || valid)(scope);
        console.log(data.itemType, elm);
        return elm;
    }

    beforeEach( module( 'menuApp' ) );
    beforeEach( module( 'menuApp.services' ) );


    beforeEach( inject( function( $compile, $rootScope, Menu, MenuItem ) {
        var timeNow = new Date();
        scope = $rootScope.$new();
        compile = $compile;

        scope.menu = new Menu();

        timeNow.setHours(18, 0, 0, 0);
        scope.menu.dinnertime = Date.parse(timeNow);

        scope.menu.createMenuItem('item one', 20, 80, 10, null);
        scope.menu.createMenuItem('item two', 15, 45, 0, 15);

        scope.myItem = scope.menu.menuItems[0];

        scope.multiplier = 1;
        scope.currentTime = "1397840180000";

    }));

    // Test bar types
    describe('test all four bar types for type one', function() {
        var testValues = [
            {
                name: 'item one',
                prep: {class: 'preptimebar', title: '4:10:00 PM - 4:30:00 PM', css: {right: '90px', width: '18px', marginRight: '0px'}},
                cook: {class: 'cooktimebar', title: '4:30:00 PM - 5:50:00 PM', css: {right: '10px', width: '78px', marginRight: ''}},
                rest: {class: 'resttimebar', title: '5:50:00 PM - 6:00:00 PM', css: {right: '', width: '', marginRight: ''}},
                finish: {class: 'finishtimebar', title: '', css: {right: '', width: '', marginRight: ''}}
            },
            {name: 'item two'}
        ];

        beforeEach(function () {
            scope.myItem = scope.menu.menuItems[0];
        });
        // Prep
        describe('test preptime bar segment', function() {
            beforeEach(function () {
                scope.itemType = "prep";
                validTemplate = '<menu-bar item-type="'+scope.itemType+'" my-item="myItem"  multiplier="multiplier" current-time="currentTime"></menu-bar>';
                element = createDirective(scope, validTemplate);
            });

            it (' should be the first menu item', inject ( function() {
                expect(scope.myItem.name).toBe(testValues[0].name);
            }));

            it (' should be a prep type bar', inject ( function() {
                expect(element.hasClass(testValues[0].prep.class)).toBe(true);
                expect(element.attr('title')).toBe(testValues[0].prep.title);
                expect(element.css('right')).toBe(testValues[0].prep.css.right);
                expect(element.css('width')).toBe(testValues[0].prep.css.width);
                expect(element.css('margin-right')).toBe(testValues[0].prep.css.marginRight);
            }));
        });
        // Cook
        describe('test cooktime bar segment', function() {

            beforeEach(function () {
                scope.itemType = "cook";
                validTemplate = '<menu-bar item-type="'+scope.itemType+'" my-item="myItem"  multiplier="multiplier" current-time="currentTime"></menu-bar>';
                element = createDirective(scope, validTemplate);
            });

            it (' should have the class cooktimebar', inject ( function() {
                expect(element.hasClass(testValues[0].cook.class)).toBe(true);
                expect(element.attr('title')).toBe(testValues[0].cook.title);
                expect(element.css('right')).toBe(testValues[0].cook.css.right);
                expect(element.css('width')).toBe(testValues[0].cook.css.width);
            }));
        });
        // Rest
        describe('test resttime bar segment', function() {

            beforeEach(function () {
                scope.itemType = "rest";
                validTemplate = '<menu-bar item-type="'+scope.itemType+'" my-item="myItem"  multiplier="multiplier" current-time="currentTime"></menu-bar>';
                element = createDirective(scope, validTemplate);
            });

            it (' should have the class resttimebar', inject ( function() {
                expect(element.hasClass('resttimebar')).toBe(true);
                expect(element.attr('title')).toBe('5:50:00 PM - 6:00:00 PM');
                //expect(element.css('right')).toBe('10px');
                //expect(element.css('width')).toBe('78px');
            }));
        });
        // Finish
        describe('test finishtime bar segment', function() {

            beforeEach(function () {
                scope.itemType = "finish";
                validTemplate = '<menu-bar item-type="'+scope.itemType+'" my-item="myItem"  multiplier="multiplier" current-time="currentTime"></menu-bar>';
                element = createDirective(scope, validTemplate);
            });

            it (' should have the class finishtimebar', inject ( function() {
                expect(element.hasClass('finishtimebar')).toBe(true);
                //expect(element.attr('title')).toBe('4:30:00 PM - 5:50:00 PM');
                //expect(element.css('right')).toBe('10px');
                //expect(element.css('width')).toBe('78px');
            }));
        });

    });

});