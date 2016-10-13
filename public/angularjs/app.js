//loading the 'profile' angularJS module

var ebay = angular.module('ebay', ['ui.router']);
  ebay.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$stateProvider
    .state('profile', {
			url : '/profile',
			views: {
              'container@': {
                templateUrl : 'templates/profile/profile.html',
                // controller: 'profile'
              },
			}
		})
    .state('displayAd', {
			url : '/',
			views: {
              'displayAd': {
                templateUrl : 'templates/displayAd.html',
                // controller: 'profile'
              },
			}
		})
    .state('payment', {
			url : '/payment',
			views: {
              'displayAd': {
                templateUrl : 'templates/payment.html',
                // controller: 'profile'
              },
			}
		})
    // .state('personalDetails', {
		// 	url : '',
    //   abstract: true,
		// 	views: {
    //           'contentDisplay@profile': {
    //             templateUrl : 'templates/profile/personalDetails.html',
    //             // controller: 'profile'
    //           },
		// 	}
		// })
    // .state('profile.sellItems', {
    //   url : '/sellItems',
    //   views: {
    //           'contentDisplay@profile': {
    //             templateUrl : 'templates/profile/sellItems.html',
    //             // controller: 'profile'
    //           },
    //   }
    // })
    console.log("in app.js angular");
		$urlRouterProvider.otherwise('/');
	})
  .run(function ($rootScope) {

  });

ebay.controller('profile', function($scope, $http){
  console.log("in controller");
  // console.log($scope.quantityEntered);

  //pre load the personal details here

  //load all Advertisement
  $http({
    method : "GET",
    url : '/loadAllAd'
  }).success(function(data) {
    console.log("success load all Advertisement");
    console.log(data);
    $scope.allAds = data;
  }).error(function(error) {
    res.end("Error retrieving all ads data");
  });

  //get cart from session
  function loadShoppingCart(){
    $http({
      method : "GET",
      url : '/shoppingCart'
    }).success(function(data) {
      console.log("success get all cart from session");
      console.log(data);
      $scope.shoppingCart = data;
    }).error(function(error) {
      console.log("Error retrieving all ads data");
    });
  };

  //call it on startup
  loadShoppingCart();

  $scope.addToCart = function(adId, quantityEntered) {
    console.log("in addToCart "+adId);
    console.log(quantityEntered);
    $http({
      method : "POST",
      url : '/addToCart',
      data : {
        "adId" : adId,
        "quantityEntered" : quantityEntered
      }
    }).success(function(data) {
      console.log("success");
      console.log(data);
      loadShoppingCart();
      // $scope.shoppingCart.push(data);
    }).error(function(error) {
      console.log("Error posting data in addToCart");
    });
  };

  //remove row from shoppingCart
  $scope.removeRow = function(cartId) {
    console.log("in removeRow");
    $http({
      method : "POST",
      url : '/removeFromCart',
      data : {
        "cartId" : cartId
      }
    }).success(function(data) {
      console.log("in removeRow success");
      loadShoppingCart();
    }).error(function(error) {
      console.log("Error posting data");
    });
  };

  //on checkout
  $scope.checkout = function(quantityEntered){
    console.log("--------checkout------");
    // console.log(quantityEntered);
    // console.log($scope.quantityEntered);
    $http({
      method : "POST",
      url : '/checkout',
      data : {
        "quantityEntered" : $scope.quantityEntered
      }
    }).success(function(data) {
      console.log("in removeRow success");
      loadShoppingCart();
    }).error(function(error) {
      console.log("Error posting data");
    });
  };

  //loads user Advertisement
  $scope.loadAd = function() {
    console.log("in loadAd");
    $http({
      method : "GET",
      url : '/loadAd'
    }).success(function(data) {
      // $scope.name = '';
      // $scope.specification = '';
      // $scope.quantity = '';
      // $scope.shipping = '';
      console.log("success");
      console.log(data);
      $scope.allAd = data;
    }).error(function(error) {
      res.end("Error posting data");
    });

  };

  $scope.soldItems = function(){
    console.log("in soldItems");
    $http({
      method : "GET",
      url : '/loadAd'
    }).success(function(data) {
      console.log("success in soldItems");
      console.log(data);
      var soldItemsDefine = [];
      for(var i=0; i<data.length; i++)
        if(data[i].status === "sold")
          soldItemsDefine.push(data[i]);
      $scope.soldItemsData = soldItemsDefine;
      console.log(soldItemsDefine);
    }).error(function(error) {
      res.end("Error posting data");
    });
  };

  $scope.publishAd = function(){
    $http({
      method : "POST",
      url : '/publishAd',
      data : {
        "name": $scope.name,
        "specification": $scope.specification,
        "quantity": $scope.quantity,
        "shipping": $scope.shipping,
        "price" : $scope.price
      }
    }).success(function(data) {
      $scope.name = '';
      $scope.specification = '';
      $scope.quantity = '';
      $scope.shipping = '';
      $scope.price = '';
    }).error(function(error) {
      console.log("Error posting data");
    });
  };

  $scope.purchasedAd = function() {
    $http({
      method : "GET",
      url : '/purchasedAd'
    }).success(function(data) {
      console.log("success in purchasedAd");
      console.log(data);
      $scope.purchasedAd = data;
    }).error(function(error) {
      console.log("Error posting data");
    });
  };

});
