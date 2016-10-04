// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services'])

/*   .run(function (, Backand) {

 })

.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    }) */
.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    // change here to your appName
    BackandProvider.setAppName('icagh');

    BackandProvider.setSignUpToken('4cb064bd-762f-4074-a9cc-9ca3277832b7');

    // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access
    BackandProvider.setAnonymousToken('4f02051d-2df2-4af6-90b5-da623e59bfee');

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
        .state('tab.members', {
            url: '/members',
            views: {
                'tab-members': {
                    templateUrl: 'templates/tab-members.html',
                    controller: 'MembersCtrl as vm'
                }
            }
        })
        .state('tab.member', {
            cache: true,
            url: '/memberdetails/:id',
            views: {
                'tab-members': {
                    templateUrl: 'templates/member.html',
                    controller: 'MemberCtrl as vm'
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
        /* .state('tab.terms', {
             cache: true,
             url: '/settings/terms',
             views: {
                 'tab-settings': {
                     templateUrl: 'templates/terms.html',
                     controller: 'SettingsCtrl as vm'
                 }
             }
         })*/
        .state('tab.about', {
            cache: true,
            url: '/settings/about',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/about.html',
                    controller: 'SettingsCtrl as vm'
                }
            }
        })
        .state('tab.profile', {
            cache: true,
            url: '/settings/profile',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl as vm'
                }
            }
        })
        .state('tab.announcements', {
            url: '/announcements',
            views: {
                'tab-announcements': {
                    templateUrl: 'templates/tab-announcements.html',
                    controller: 'AnnouncementsCtrl as vm'
                }
            }
        })
        .state('tab.announcement', {
            cache: true,
            url: '/announcement/:id',
            views: {
                'tab-announcements': {
                    templateUrl: 'templates/info.html',
                    controller: 'AnnouncementCtrl as vm'
                }
            }
        });

    $urlRouterProvider.otherwise('/tabs/members');
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

    $rootScope.pageSize = 5;

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
        //console.log(toState)
        if (toState.name == 'login') {
            signout();
        } else if (toState.name != 'login' && Backand.getToken() === null) {
            unauthorized();
        }
    });

})