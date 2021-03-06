describe( 'Model service tests', function() {
    var menuItemSvc,
        menuSvc;

    beforeEach(function () {
      module('menuApp');
      inject(function(MenuItem, Menu){
        MenuItemSvc = MenuItem;
        MenuSvc = Menu;
      });
    });

    describe( 'Menu tests', function() {
        var thisMenu;
        beforeEach(function () {
          thisMenu = new MenuSvc('name', 0, 0);
        });

        it ('should be an object', function() {
          expect(angular.isObject(thisMenu)).toBe(true);
        });

        it ('should have default values', function() {
            expect(thisMenu.menuItems instanceof Array).toBe(true);
            expect(thisMenu.menuItems.length).toEqual(0);
            expect(thisMenu.starttime).toEqual(0);
            expect(thisMenu.dinnertime).toEqual(null);
        });

        // test createMenuItems method

        // test calcTimes method

    });

    describe( 'MenuItem tests', function() {

        it ('should be an object', function() {
          var thisItem = new MenuItemSvc('name', 0, 0);

          expect(angular.isObject(thisItem)).toBe(true);
        });

        it ('should have initial values set as passed and defaults', function() {
          var thisItem = new MenuItemSvc('myname', 20, 40);

          expect(thisItem.name).toEqual('myname');
          expect(thisItem.start).toEqual(20);
          expect(thisItem.done).toEqual(40);
        });

        it ('should have a setMenuTime function', function () {
          var thisItem = new MenuItemSvc('name', 0, 0);

          expect(angular.isFunction(thisItem.setMenuTime)).toBe(true);
        });

        it ('should have values changed via setMenuTime function', function() {
          var thisItem = new MenuItemSvc('myname', 20, 40);
          thisItem.setMenuTime('finishtime', 10, 15, 20);
          thisItem.setMenuTime('resttime', 30, 115, 120);
          thisItem.setMenuTime('cooktime', 60, 1115, 1120);
          thisItem.setMenuTime('preptime', 90, 11115, 11120);

          expect(thisItem.finishtime.time).toEqual(10);
          expect(thisItem.resttime.time).toEqual(30);
          expect(thisItem.cooktime.time).toEqual(60);
          expect(thisItem.preptime.time).toEqual(90);
        });
    });
});