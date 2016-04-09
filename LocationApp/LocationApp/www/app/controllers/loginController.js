app.controller("loginController", ["$scope", "$state", "$location", "$ionicModal", "$ionicPopup", "authService", function ($scope, $state, $location, $ionicModal, $ionicPopup, authService) {
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

    $scope.logoutUser = function () {
        authService.logout();
    }

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