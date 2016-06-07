'use strict';

/**
 * @ngdoc function
 * @name halzaPortalAppApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the halzaPortalAppApp
 */
angular.module('halzaPortalAppApp')
  .controller('SignUpCtrl', ['$scope', 'GooglePlus', '$http', '$location', 
  	function ($scope, GooglePlus, $http, $location) {

  		//sign up by email
  		$scope.user = {email: "", password: ""};
    	$scope.signUpByEmail = function(){
            console.log('signUpByEmail');
			var data = $.param({
	            json: JSON.stringify({
	                email: $scope.user.email,
	                password: $scope.user.password
	            })
	        });
	        $http.post("", data).success(function(data, status) {
	        	$location.path("/");
	        })
    	};

        //sign in by email
        $scope.loginByEmail = function () {
            var data = $.param({
                json: JSON.stringify({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
            });
            $http.post("", data).success(function(data, status) {
                $location.path("/home");
            })
    };

    	//sign in by google
    	$scope.loginByGoogle = function () {
        GooglePlus.login().then(function (authResult) {
            console.log(authResult);

            GooglePlus.getUser().then(function (user) {
                console.log(user);
                $location.path("/home");
            });
        }, function (err) {
            console.log(err);
        });
    };

	//sign in by linked in
    $scope.linkedinMsg = {};
    $scope.showLinkedinLogin = true;
    $scope.showEmailForm = true;
    
    $scope.linkedinProfileDataCallback = function(data){
        console.log('profileDataCallback',data);
        $location.path("/home");
    };

  }]);
