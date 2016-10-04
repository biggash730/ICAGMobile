angular.module('SimpleRESTIonic.controllers', [])

.controller('LoginCtrl', function(Backand, $state, $rootScope, LoginService, $ionicLoading) {
    var login = this;
    $ionicLoading.hide();

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
        //console.log(vm.user.name)

        function signout() {
            LoginService.signout()
                .then(function() {
                    $state.go('login');
                })
        }

        /*function openProfilex() {
            $state.go('tab.profile')
        }*/
        vm.signout = signout;
        /*vm.openProfile = openProfile;*/
    })
    .controller('ProfileCtrl', function(Backand, $state, $rootScope, LoginService, AuthService, $ionicLoading) {
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
                    $ionicLoading.hide();
                    console.log('error')
                });
        }

        function getNewData() {
            vm.page = 0;
            getData();
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
        vm.getNewData = getNewData;
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
                    $ionicLoading.hide();
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
    .controller('FirmsCtrl', function(Backand, FirmsModel, $rootScope, $ionicLoading) {
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
            FirmsModel.some(vm.page * vm.pageSize)
                .then(function(result) {
                    $ionicLoading.hide();
                    vm.data = result.data;
                    vm.total = result.totalRows;
                    $rootScope.$broadcast('scroll.refreshComplete');
                }).catch(function(e) {
                    $ionicLoading.hide();
                    console.log('error')
                });
        }

        function search() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            //console.log(vm.query)
            FirmsModel.search(vm.query)
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
    .controller('FirmCtrl', function(FirmsModel, $state, $rootScope, $ionicLoading) {
        var vm = this;
        vm.id = $state.params.id;
        //console.log(vm.id)

        function getOne() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });
            FirmsModel.getOne(vm.id)
                .then(function(result) {
                    $ionicLoading.hide();
                    vm.data = result.data;
                });
        }
        getOne();
    });