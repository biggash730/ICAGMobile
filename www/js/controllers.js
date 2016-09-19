angular.module('SimpleRESTIonic.controllers', [])

.controller('LoginCtrl', function(Backand, $state, $rootScope, LoginService) {
    var login = this;

    function onLogin(username) {
        $rootScope.$broadcast('authorized');
        $state.go('tab.dashboard');
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

.controller('SettingsCtrl', function(Backand, $state, $rootScope, LoginService) {
    var vm = this;

    vm.signout = signout;

    $rootScope.$on('logout', function() {
        $state.go('login');
    });

    function signout() {
        console.log(00)
        LoginService.signout()
            .then(function() {
                $state.go('login');
                $rootScope.$broadcast('logout');
                $state.go($state.current, {}, { reload: true });
            })
    }
})

.controller('AnnouncementsCtrl', function(AnnouncementsModel, $rootScope) {
        var vm = this;



    })
    .controller('MembersCtrl', function(MembersModel, $rootScope) {
        var vm = this;
        vm.query = null
        vm.pageSize = $rootScope.pageSize;
        vm.page = 0;
        vm.total = 0;

        function getAll() {
            MembersModel.all()
                .then(function(result) {
                    vm.data = result.data.data;
                });
        }

        function getData() {
            vm.page = vm.page + 1;
            MembersModel.some(vm.page * vm.pageSize)
                .then(function(result) {
                    //console.log(result.data)
                    vm.data = result.data;
                    vm.total = result.totalRows;
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
        }

        function search() {
            console.log(vm.query)
            MembersModel.search(vm.query)
                .then(function(result) {
                    vm.data = result.data;
                    vm.total = result.totalRows;
                });
        }

        function clearData() {
            vm.data = null;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.getData = getData;
        vm.search = search;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function() {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function() {
            clearData();
        });

        if (!vm.isAuthorized) {
            $rootScope.$broadcast('logout');
        }

        getData();

    })
    .controller('MemberCtrl', function(MembersModel, $state, $rootScope) {
        var vm = this;
        vm.id = $state.params.id;
        //console.log(vm.id)

        function getOne() {
            MembersModel.getOne(vm.id)
                .then(function(result) {
                    //console.log(result.data)
                    vm.data = result.data;
                });
        }

        getOne();



    });