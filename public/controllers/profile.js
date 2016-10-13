angular.module('ebay')
  .controller('profile', function($scope){
    console.log("in porfile controller");
    $scope.changeView = function(viewId) {
      console.log("change View");
      // if(viewId == '1'){
      //   $scope.uiView = "personalDetails";
      // }
      // var el = angular.element(document.querySelector('#viewDiv'));
      // el.attr('ui-view', 'personalDetails');
    };
  })
