app.directive("logOut", ["authService", function (authService) {
    return {
        link: function (scope, element) {

            element.on("click", function () {
                authService.logout();
            })
        }
    }
}])