'use strict';

/**
 * @ngdoc function
 * @name halzaPortalAppApp.controller:SignInCtrl
 * @description
 * # SignInCtrl
 * Controller of the halzaPortalAppApp
 */
angular.module('halzaPortalAppApp')
  .controller('SignInCtrl', ['$scope', 'GooglePlus', '$http', '$state', '$cookies','$rootScope', 
    'authentication','$stateParams', 'linkedInCallback', '$localStorage',
  	function ($scope, GooglePlus, $http, $state, $cookies, $rootScope, authentication, 
      $stateParams, linkedInCallback, $localStorage) {

       if($localStorage.access_token != undefined){
           $state.go("home");          
       }

       $scope.user = {username: "", password: "", accessToken: "", isRemember: false};
       $scope.isRemember = false;
       $scope.errMessage = "";
       $scope.isError = false;
       $scope.access_token = "";
       $scope.isLoading = false;

       var  config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        //sign in by email
        $scope.loginByEmail = function () {
            $scope.isLoading = true;
            var sendData = $.param({
                username: $scope.user.username,
                password: $scope.user.password,
                //isRemember: $scope.user.isRemember,
                grant_type: "password"
            });

            authentication.signIn(sendData, config)
            .success(function (dataBack) {
                $scope.isLoading = false;
                $scope.access_token = dataBack.access_token;
                $rootScope.$broadcast('user:logged', dataBack);
                if($scope.isRemember){
                    $localStorage.access_token = dataBack.access_token;
                }
                $state.go("home");
            })
            .error(function (error) {
                $scope.isLoading = false;
                $scope.errMessage=  error.error_description;
                $scope.isError = true;
            });
        };

    	//sign in by google
    	$scope.loginByGoogle = function () {
        GooglePlus.login().then(function (authResult) {
             
            GooglePlus.getUser().then(function (user) {
                var sendData = $.param({
                provider: 'Google',
                externalAccessToken: authResult.access_token,
                userName: user.email,
                userId: user.id
                });

                authentication.signInByGoogle(sendData, config)
                .success(function (response) {
                    $scope.access_token = response.data.access_token;
                    $rootScope.$broadcast('user:logged', response.data);
                    $state.go("home");

                })
                .error (function (response) {
                    $scope.errMessage=  response.modelState;
                    $scope.isError = true;
                });
                
            });
        }, function (err) {
            console.log(err);
        });
    };
    
	   //sign in by linked in
     $scope.loginByLinkedIn = function(){
        var client_id = '75auoha37nqt11';
        var redirect_uri = 'http://localhost:3000/callback';
        window.location = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id="
        + client_id + "&redirect_uri=" +  redirect_uri + "&state=987654321&scoper_emailaddress"; 
     };

  }]);
