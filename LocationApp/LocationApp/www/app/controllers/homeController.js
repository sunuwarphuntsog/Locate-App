app.controller("homeCtrl", ["$scope", "$state", "$ionicPopup", "authService", "AUTH_EVENTS", "$http", function ($scope, $state, $ionicPopup, authService, AUTH_EVENTS, $http) {
    $scope.refresh = function () {
        //refresh binding
        $scope.$broadcast("scroll.refreshComplete");
    };

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