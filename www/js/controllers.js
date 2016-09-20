angular.module('SimpleRESTIonic.controllers', [])

.controller('LoginCtrl', function(Backand, $state, $rootScope, LoginService) {
    var login = this;

    function onLogin(username) {
        $rootScope.$broadcast('authorized');
        $state.go('tab.members');
        login.username = username || Backand.getUsername();
    }

    function signout() {
        LoginService.signout()
            .then(function() {
                //$state.go('tab.login');
                $rootScope.$broadcast('logout');
                $state.go($state.current, {}, { reload: true });
            })

    }

    function socialSignIn(provider) {
        LoginService.socialSignIn(provider)
            .then(onValidLogin, onErrorInLogin);

    }

    function socialSignUp(provider) {
        LoginService.socialSignUp(provider)
            .then(onValidLogin, onErrorInLogin);

    }

    onValidLogin = function(response) {
        onLogin();
        login.username = response.data || login.username;
    }

    onErrorInLogin = function(rejection) {
        login.error = rejection.data;
        $rootScope.$broadcast('logout');

    }


    login.username = '';
    login.error = '';
    login.signout = signout;
    login.socialSignup = socialSignUp;
    login.socialSignin = socialSignIn;

})

.controller('SettingsCtrl', function(Backand, $state, $rootScope, LoginService, AuthService, $ionicLoading) {
    var vm = this;
    vm.user = AuthService.currentUser;
    console.log(vm.user.name)

    function signout() {
        LoginService.signout()
            .then(function() {
                $state.go('login');
            })
    }
    vm.signout = signout;
})

.controller('AnnouncementsCtrl', function(AnnouncementsModel, $rootScope, $ionicLoading) {
        var vm = this;
        vm.query = null
        vm.pageSize = 15;
        vm.page = 0;
        vm.total = 0;

        function getData() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            vm.page = vm.page + 1;
            AnnouncementsModel.some(vm.page * vm.pageSize)
                .then(function(result) {
                    $ionicLoading.hide();
                    //console.log(result.data)
                    vm.data = result.data;
                    vm.total = result.totalRows;
                    $rootScope.$broadcast('scroll.refreshComplete');
                }).catch(function(e) {
                    comsole.log('error')
                });
        }

        function search() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            //console.log(vm.query)
            AnnouncementsModel.search(vm.query)
                .then(function(result) {
                    $ionicLoading.hide();
                    vm.data = result.data;
                    vm.total = result.totalRows;
                });
        }

        function clearData() {
            vm.data = null;
        }

        vm.objects = [];
        vm.getData = getData;
        vm.search = search;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function() {
            vm.isAuthorized = true;
            getData();
        });

        $rootScope.$on('logout', function() {
            clearData();
        });

        if (!vm.isAuthorized) {
            $rootScope.$broadcast('logout');
        }

        getData();
    })
    .controller('MembersCtrl', function(Backand, MembersModel, $rootScope, $ionicLoading) {
        var vm = this;
        vm.query = null
        vm.pageSize = $rootScope.pageSize;
        vm.page = 0;
        vm.total = 0;

        function getData() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            vm.page = vm.page + 1;
            MembersModel.some(vm.page * vm.pageSize)
                .then(function(result) {
                    $ionicLoading.hide();
                    //console.log(result.data)
                    vm.data = result.data;
                    vm.total = result.totalRows;
                    $rootScope.$broadcast('scroll.refreshComplete');
                }).catch(function(e) {
                    comsole.log('error')
                });
        }

        function search() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            //console.log(vm.query)
            MembersModel.search(vm.query)
                .then(function(result) {
                    $ionicLoading.hide();
                    vm.data = result.data;
                    vm.total = result.totalRows;
                });
        }

        function clearData() {
            vm.data = null;
        }

        vm.objects = [];
        vm.getData = getData;
        vm.search = search;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function() {
            vm.isAuthorized = true;
            getData();
        });

        $rootScope.$on('logout', function() {
            clearData();
        });

        if (!vm.isAuthorized) {
            $rootScope.$broadcast('logout');
        }

        getData();

    })
    .controller('MemberCtrl', function(MembersModel, $state, $rootScope, $ionicLoading) {
        var vm = this;
        vm.id = $state.params.id;
        //console.log(vm.id)

        function getOne() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            MembersModel.getOne(vm.id)
                .then(function(result) {
                    $ionicLoading.hide();
                    //console.log(result.data)
                    vm.data = result.data;
                });
        }

        getOne();



    })
    .controller('AnnouncementCtrl', function(AnnouncementsModel, $state, $rootScope, $ionicLoading) {
        var vm = this;
        vm.id = $state.params.id;
        //console.log(vm.id)

        function getOne() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            AnnouncementsModel.getOne(vm.id)
                .then(function(result) {
                    $ionicLoading.hide();
                    //console.log(result.data)
                    vm.data = result.data;
                });
        }

        getOne();



    });