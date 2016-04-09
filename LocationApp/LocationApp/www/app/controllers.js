(function () {
    "use strict";

    angular.module("myapp.controllers", [])

    .controller("appCtrl", ["$scope", function ($scope) {
    }])

    //homeCtrl provides the logic for the home screen
    .controller("homeCtrl", ["$scope", "$state", "$ionicPopup", "authService", "AUTH_EVENTS", "$http", function ($scope, $state, $ionicPopup, authService, AUTH_EVENTS, $http) {
        $scope.refresh = function () {
            //refresh binding
            $scope.$broadcast("scroll.refreshComplete");
        };

        $scope.dummyCall = function () {
            $http.get("http://localhost:8010/dummyCall").then(
                function (response) {
            }, function (error) {
                //log the error 
            });
        };

        $scope.dummyCall();

        $scope.userName = authService.userName();

        $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
            var alertPopup = $ionicPopup.alert({
                title: "Unauthorized",
                template: "You are not allowed to access this resource."
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
            authService.logout();
            $state.go("app.login", {}, { reload: true });
            var alertPopup = $ionicPopup.alert({
                title: "Session lost",
                template: "Sorry, you have to login again."
            });
        });


        $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'You are not allowed to access this resource.'
            });
        });

        //should be able to remove later. 
        $scope.setCurrentUsername = function (name) {
            $scope.userName = name; 
        }



        //get the data to display the the home page 
        //get(https://asdasda)

    }])

    //login Controller 
    .controller("loginController", ["$scope", "$state", "$location", "$ionicModal", "$ionicPopup", "authService", function ($scope, $state, $location, $ionicModal, $ionicPopup, authService) {
        $scope.refresh = function () {
            //refresh binfing 
            $scope.$broadcast("scroll.refreshComplete");
        };

        $scope.data = {};

        $scope.goToRegistration = function () {
            $state.go("app.registration"); 
        };

        //login Modal 
        $ionicModal.fromTemplateUrl('app/modalTemplates/loginModal.html', {
            scope: $scope,
            animation: 'no-animation'
        }).then(function (modal) {
            $scope.signInModal = modal;
        });

        $scope.openSigninModal = function () {
            $scope.signInModal.show();
        };
        $scope.closeSigninModal = function () {
            $scope.signInModal.hide();
        };

        //login service 
        $scope.login = function (data) {
            authService.login(data.username, data.password).then(function (auhtneticated) {
                $state.go("app.home", {}, { reload: true });
                $scope.closeSigninModal();
            }, function (err) {
                var alertPopup = $ionicPopup.alert({
                    title: "Login Failed",
                    template: "Please check Your credentials"
                });
            });
        };


    }])

    //Registration Controller 
    .controller("registrationController", ["$scope", "$state", function ($scope, $state) {
        $scope.refresh = function () {
            //refresh binfing 
            $scope.$broadcast("scroll.refreshComplete");
        };
     }])

    //errorCtrl managed the display of error messages bubbled up from other controllers, directives, myappService
    .controller("errorCtrl", ["$scope", "myappService", function ($scope, myappService) {
        //public properties that define the error message and if an error is present
        $scope.error = "";
        $scope.activeError = false;

        //function to dismiss an active error
        $scope.dismissError = function () {
            $scope.activeError = false;
        };

        //broadcast event to catch an error and display it in the error section
        $scope.$on("error", function (evt, val) {
            //set the error message and mark activeError to true
            $scope.error = val;
            $scope.activeError = true;

            //stop any waiting indicators (including scroll refreshes)
            myappService.wait(false);
            $scope.$broadcast("scroll.refreshComplete");

            //manually apply given the way this might bubble up async
            $scope.$apply();
        });
    }]);
})();