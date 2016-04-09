    app.service("authService", ["$q", "$http", "USER_ROLES", "$rootScope", function ($q, $http, USER_ROLES, $rootScope) {
        var authService = {};
        var LOCAL_TOKEN_KEY = "yourTokenKey";
        var userName = "";
        var isAuthenticated = false;
        var role = "";
        var authToken;

        //private methods 
        var loadUserCredentials = function () {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        };
        var storeUserCredentials = function (token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            //store the token to session storage 
            useCredentials(token);
        };
        var useCredentials = function (token) {
            userName = token.split(".")[0];
            isAuthenticated = true;
            authToken = token;

            if (userName == "admin") {
                role = USER_ROLES.admin;
            }
            if (userName == "user") {
                role = USER_ROLES.basic;
            }

            $http.defaults.headers.common["X-Auth-Token"] = token;
        };
        var destroyUserCredentials = function () {
            authToken = undefined;
            userName = "";
            isAuthenticated = false;
            $http.defaults.headers.common["X-Auth-Token"] = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }


        loadUserCredentials();

        //services
        authService.login = function (name, pw) {
            return $q(function (resolve, reject) {
                if ((name == "admin" && pw == "1") || (name == 'user' && pw == "1")) {
                    storeUserCredentials(name + ".yourServerToken");
                    resolve("Login Success");
                } else {
                    reject("Login Failed")
                }
            });
        };
        authService.logout = function () {
            destroyUserCredentials();
        };

        //logout function for menu url. 
        $rootScope.logoutUser = authService.logout();

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };
        authService.isAuthenticated = function () {
            return isAuthenticated;
        };
        authService.userName = function () {
            return userName;
        };
        authService.role = function () {
            return role;
        };

        return authService;
    }])