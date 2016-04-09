//(function () {
//    "use strict";

//var app = angular.module("myapp", ["ionic", "myapp.controllers", "myapp.services", "ngMockE2E"]);

var app = angular.module("myapp", ["ionic", "ngMockE2E"]);

app.run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
            $stateProvider
            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "app/templates/view-menu.html",
                controller: "appCtrl"
            })
            .state("app.home", {
                url: "/home",
                templateUrl: "app/templates/view-home.html",
                controller: "homeCtrl",
                data: { authorizedRoles: [USER_ROLES.basic] }
            })
            .state("app.login", {
                url: "/login",
                templateUrl: "app/templates/view-login.html",
                controller: "loginController"
            })
            .state("app.registration", {
                url: "/registration",
                templateUrl: "app/templates/view-registration.html",
                controller: "registrationController"
            });
            $urlRouterProvider.otherwise("/app/login");
        })
.constant("AUTH_EVENTS", {
            notAuthenticated: "auth-not-authenticated",
            notAuthorized: "auth-not-authorized"
        })
.constant("USER_ROLES", {
            admin: "admin_role",
            basic: "basic_role"
        });


//authorization 
 app.run(function ($rootScope, $state, authService, AUTH_EVENTS) {
            $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {

                if ('data' in next && 'authorizedRoles' in next.data) {
                    var authorizedRoles = next.data.authorizedRoles;
                    if (!authService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        $state.go($state.current, {}, { reload: true });
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    }
                }


                if (!authService.isAuthenticated()) {

                    if (next.name !== "app.registration") {
                        if (next.name !== 'app.login') {
                            event.preventDefault();
                            $state.go('app.login', {}, { reload: true });
                        };
                    };
                    
                }

            });
        });
//authorization 


//backend Mock 
app.run(function ($httpBackend) {
            $httpBackend.whenGET("http://localhost:8010/dummyCall")
                                .respond({ message: "Not Authenticated" });

            $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
            $httpBackend.whenGET(/modalTemplates\/\w+.*/).passThrough();
        });
//backend Mock 


//Authentication Interceptor.........
app.factory("authInterceptor", ["$rootScope", "$q", "AUTH_EVENTS", function ($rootScope, $q, AUTH_EVENTS) {

            return {

                responseError: function (response) {
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized
                    }[response.status], response);
                    return $q.reject(response); 
                }
            };
        }]);
app.config(function ($httpProvider) {
            $httpProvider.interceptors.push("authInterceptor");
        });
//Authentication Interceptor..............


        


