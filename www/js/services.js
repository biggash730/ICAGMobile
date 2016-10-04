angular.module('SimpleRESTIonic.services', [])

.service('APIInterceptor', function($rootScope, $q) {
    var service = this;

    service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
        }
        return $q.reject(response);
    };
})

.service('MembersModel', function($http, Backand, AuthService) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'icagmembers/';
        var token = AuthService.getUserToken();

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function() {
            return $http.get(getUrl());
        };


        service.some = function(pageSize) {
            var sort = [{ "fieldName": "name", "order": "asc" }]
            return $http({
                method: 'GET',
                url: getUrl(),
                params: {
                    pageSize: pageSize,
                    sort: sort
                },
                headers: token
            }).then(function(response) {
                return response.data;
            });
        };

        service.search = function(q) {
            var filter = [{ "fieldName": "name", "operator": "contains", "value": q }]
            return $http({
                method: 'GET',
                url: getUrl(),
                params: {
                    filter: filter
                },
                headers: token
            }).then(function(response) {
                return response.data;
            });
        };

        service.fetch = function(id) {
            return $http.get(getUrlForId(id));
        };

        service.getOne = function(id) {
            return $http({
                method: 'GET',
                url: getUrlForId(id),
                params: {
                    deep: true
                }
            });
        };
    })
    .service('FirmsModel', function($http, Backand, AuthService) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'icagfirms/';
        var token = AuthService.getUserToken();

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function() {
            return $http.get(getUrl());
        };


        service.some = function(pageSize) {
            var sort = [{ "fieldName": "name", "order": "asc" }]
            return $http({
                method: 'GET',
                url: getUrl(),
                params: {
                    pageSize: pageSize,
                    sort: sort
                },
                headers: token
            }).then(function(response) {
                return response.data;
            });
        };

        service.search = function(q) {
            var filter = [{ "fieldName": "name", "operator": "contains", "value": q }]
            return $http({
                method: 'GET',
                url: getUrl(),
                params: {
                    filter: filter
                },
                headers: token
            }).then(function(response) {
                return response.data;
            });
        };

        service.fetch = function(id) {
            return $http.get(getUrlForId(id));
        };

        service.getOne = function(id) {
            return $http({
                method: 'GET',
                url: getUrlForId(id),
                params: {
                    deep: true
                }
            });
        };
    })
    .service('AnnouncementsModel', function($http, Backand, AuthService) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'icagannouncements/';
        var token = AuthService.getUserToken();

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function() {
            return $http.get(getUrl());
        };


        service.some = function(pageSize) {
            var sort = [{ "fieldName": "date", "order": "desc" }]
            return $http({
                method: 'GET',
                url: getUrl(),
                params: {
                    pageSize: pageSize,
                    sort: sort
                },
                headers: token
            }).then(function(response) {
                return response.data;
            });
        };

        service.search = function(q) {
            var filter = [{ "fieldName": "name", "operator": "contains", "value": q }]
            return $http({
                method: 'GET',
                url: getUrl(),
                params: {
                    filter: filter
                },
                headers: token
            }).then(function(response) {
                return response.data;
            });
        };

        service.fetch = function(id) {
            return $http.get(getUrlForId(id));
        };

        service.getOne = function(id) {
            return $http({
                method: 'GET',
                url: getUrlForId(id),
                params: {
                    deep: true
                }
            });
        };
    })

.service('LoginService', function(Backand) {
    var service = this;

    service.signin = function(email, password, appName) {
        //call Backand for sign in
        return Backand.signin(email, password);
    };

    service.anonymousLogin = function() {
        // don't have to do anything here,
        // because we set app token att app.js
    }

    service.socialSignIn = function(provider) {
        return Backand.socialSignIn(provider);
    };

    service.socialSignUp = function(provider) {
        return Backand.socialSignUp(provider);

    };

    service.signout = function() {
        return Backand.signout();
    };

    service.signup = function(firstName, lastName, email, password, confirmPassword) {
        return Backand.signup(firstName, lastName, email, password, confirmPassword);
    }
})

.service('AuthService', function($http, Backand) {

    var self = this;
    var baseUrl = Backand.getApiUrl() + '/1/objects/';
    self.appName = ''; //CONSTS.appName || '';
    self.currentUser = {};

    loadUserDetails();

    function loadUserDetails() {
        self.currentUser.name = Backand.getUsername();
        if (self.currentUser.name) {
            getCurrentUserInfo()
                .then(function(data) {
                    self.currentUser.details = data;
                });
        }
    }

    self.getSocialProviders = function() {
        return Backand.getSocialProviders()
    };

    self.socialSignIn = function(provider) {
        return Backand.socialSignIn(provider)
            .then(function(response) {
                loadUserDetails();
                return response;
            });
    };

    self.socialSignUp = function(provider) {
        return Backand.socialSignUp(provider)
            .then(function(response) {
                loadUserDetails();
                return response;
            });
    };

    self.setAppName = function(newAppName) {
        self.appName = newAppName;
    };

    self.signIn = function(username, password, appName) {
        return Backand.signin(username, password, appName)
            .then(function(response) {
                loadUserDetails();
                return response;
            });
    };

    self.signUp = function(firstName, lastName, username, password, parameters) {
        return Backand.signup(firstName, lastName, username, password, password, parameters)
            .then(function(signUpResponse) {

                if (signUpResponse.data.currentStatus === 1) {
                    return self.signIn(username, password)
                        .then(function() {
                            return signUpResponse;
                        });

                } else {
                    return signUpResponse;
                }
            });
    };

    self.getUserToken = function() {
        return Backand.getToken()
    };

    self.changePassword = function(oldPassword, newPassword) {
        return Backand.changePassword(oldPassword, newPassword)
    };

    self.requestResetPassword = function(username) {
        return Backand.requestResetPassword(username, self.appName)
    };

    self.resetPassword = function(password, token) {
        return Backand.resetPassword(password, token)
    };

    self.logout = function() {
        Backand.signout().then(function() {
            angular.copy({}, self.currentUser);
        });
    };

    function getCurrentUserInfo() {
        return $http({
            method: 'GET',
            url: baseUrl + "users",
            params: {
                filter: JSON.stringify([{
                    fieldName: "email",
                    operator: "contains",
                    value: self.currentUser.name
                }])
            }
        }).then(function(response) {
            if (response.data && response.data.data && response.data.data.length == 1)
                return response.data.data[0];
        });
    }

});