describe( 'MyCtrl tests' , function() {

  var MyCtrl, $location, $scope;

    beforeEach( module( 'menuApp' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      MyCtrl = $controller( 'MyCtrl', { $location: $location, $scope: $scope });
    }));

    // Test formatDate
    it (' should format a date from milliseconds to readable time', inject ( function() {
      var millisecs = 1378498315000;
      expect( $scope.formatDate(millisecs)).toBe('4:11:55 PM');
    }));

    // set dinnertime

    // add menuitem

    // calctimes


    // sortmenu

    

});