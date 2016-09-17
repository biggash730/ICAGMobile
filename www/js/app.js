// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services'])

/*   .run(function (, Backand) {

 })
 */
.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    // change here to your appName
    BackandProvider.setAppName('debttracker');

    BackandProvider.setSignUpToken('173d6800-0e4e-468d-9eff-c06bd2276abf');

    // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access
    BackandProvider.setAnonymousToken('506ac32f-6531-47d3-a06c-934f8da8610f');

    $stateProvider
    // setup an abstract state for the tabs directive
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl as login'
        })
        .state('tab', {
            url: '/tabs',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('tab.dashboard', {
            url: '/dashboard',
            views: {
                'tab-dashboard': {
                    templateUrl: 'templates/tab-dashboard.html',
                    controller: 'DashboardCtrl as vm'
                }
            }
        })

    .state('tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/tab-settings.html',
                    controller: 'SettingsCtrl as vm'
                }
            }
        })
        .state('tab.customers', {
            url: '/customers',
            views: {
                'tab-customers': {
                    templateUrl: 'templates/tab-customers.html',
                    controller: 'CustomersCtrl as vm'
                }
            }
        });

    $urlRouterProvider.otherwise('/tabs/dashboard');
    $httpProvider.interceptors.push('APIInterceptor');
})

.run(function($ionicPlatform, $rootScope, $state, LoginService, Backand) {

    $ionicPlatform.ready(function() {

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }


        var isMobile = !(ionic.Platform.platforms[0] == "browser");
        Backand.setIsMobile(isMobile);
        Backand.setRunSignupAfterErrorInSigninSocial(true);
    });

    function unauthorized() {
        console.log("user is unauthorized, sending to login");
        $state.go('login');
    }

    function signout() {
        LoginService.signout();
    }

    $rootScope.$on('unauthorized', function() {
        unauthorized();
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        console.log(toState)
        if (toState.name == 'login') {
            signout();
        } else if (toState.name != 'login' && Backand.getToken() === undefined) {
            unauthorized();
        }
    });

})