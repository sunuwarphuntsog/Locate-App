app.controller("registrationController", ["$scope", "$state", "authService", function ($scope, $state, authService) {
    $scope.refresh = function () {
        //refresh binfing 
        $scope.$broadcast("scroll.refreshComplete");
    };
}])