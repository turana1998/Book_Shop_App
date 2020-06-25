//const { response } = require("express");


angular
    .module('app', ['ngMaterial', 'ngMessages', 'ngAria', 'ngAnimate', 'ngRoute'])
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: "dashboard/index.html"
            })
            .when('/users', {
                templateUrl: 'users/index.html',
                controller: 'UsersController'
            })
            .when('/users_add', {
                templateUrl: 'users/users_add.html',
                controller: 'UsersAddController'
            })
            .when('/writers', {
                templateUrl: 'writers/index.html',
                controller: 'WritersController'
            })
            .when('/writers_add', {
                templateUrl: 'writers/writers_add.html',
                controller: 'WritersAddController'
            })
            .when('/categories', {
                templateUrl: './categories/index.html',
                controller: 'CategoriesController'
            })
            .when('/category_add', {
                templateUrl: './categories/categery_add.html',
                controller: 'CategoryAddController'
            })
            .when('/books_add', {
                templateUrl: './books/books_add.html',
                controller: 'BooksAddController'
            })
            .when('/books', {
                templateUrl: 'books/index.html',
                controller: 'BooksController'
            })
            .when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginController'
            })
            .when('/books/:id', {
                templateUrl: 'books/books.html',
                controller: 'BooksIdController'
            }).otherwise({
                redirectTo: "/"
            })
    }])
    .run(($rootScope) => {
        $rootScope.api_url = 'http://localhost:3000'
    })
    .factory('common', ($mdToast, $log, $rootScope, $http) => {
        let user;
        return {
            goPage: (url) => {
                window.location.href = window.location.origin + url;
            },
            showMessage: (message) => {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .hideDelay(3000))
                    .then(function () {
                        $log.log('Toast dismissed.');
                    }).catch(function () {
                        $log.log('Toast failed or was forced to close early by another toast.');
                    });
            },
            getUser: () => {
                return this.user;
            },
            setUser: (user) => {
                this.user = user;
            },
            getCategories: () => {
                $http({
                    url: $rootScope.api_url + '/categories',
                    method: "GET"
                }).then(response => {
                    $rootScope.categories = response.data
                }, err => {
                    common.showMessage('Xəta baş verdi');
                    console.log(err);
                })
            },
            getWriters: () => {
                $http({
                    url: $rootScope.api_url + '/writers',
                }).then((response) => {
                    $rootScope.writers = response.data;
                }, (err) => {
                    common.showMessage(err.stack);
                    console.log(err);
                })
            }

        }
    })
    .directive('loading', () => {
        return {
            strict: 'E',
            templateUrl: 'directives/loading.html'
        }
    })
    .controller('AppCtrl', function ($scope, $mdSidenav, common) {
        $scope.toggleLeft = buildToggler('left');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }
    }).controller('LeftCtrl', ($scope, $location, common) => {
        $scope.close = () => {

        }

        $scope.goPage = common.goPage;


    })

    .controller('UsersController', ($scope, $http, $mdToast, $log, $rootScope, common, $mdDialog) => {
        $scope.pagination = { current: 1, total: 0, maxpage: 0 }
        $scope.fillPages = () => {
            console.log($scope.pagination);
            $scope.pages = [];
            for (let i = 0; i < $scope.pagination.maxpage; i++) {
                $scope.pages.push({ id: i + 1, selected: i == $scope.pagination.current })
            }
        }

        $scope.delete = (user) => {
            $http({
                url: $scope.api_url + '/users/' + user._id,
                method: 'DELETE'
            }).then(response => {
                common.showMessage('Istifadeci silindi');
                $scope.getUsers();
            }, (err) => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        };



        $scope.showDetailModal = (ev, user) => {
            common.setUser(user);
            $mdDialog.show({
                controller: UserDetCtrl,
                templateUrl: './users/user_detailed.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }

        function UserDetCtrl($scope, $mdDialog, common) {
            $scope.user = common.getUser();
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

        $scope.changePage = (page) => {
            console.log(page);
            $scope.pagination.current = page;
            $scope.getUsers(page);
        }

        $scope.getUsers = (page) => {
            $http({
                url: $scope.api_url + '/users',
            }).then((response) => {
                $scope.users = response.data;
                $scope.pagination.total = $scope.users.length;
                $scope.pagination.maxpage = $scope.pagination.total / 6;
                $scope.fillPages();

            }, (err) => {
                common.showMessage(err.stack);
                console.log(err);
            })
        }
        $scope.getUsers($scope.pagination.current);

        $scope.showUser = (index) => {
            $scope.selectedUser = $scope.users[index];
            localStorage.setItem('selectedUser', JSON.stringify($scope.selectedUser));
            common.goPage('#/users/' + $scope.selectedUser.id);
        }
    })
    .controller('BooksController', ($scope, $http, common) => {
        common.getCategories();
        $scope.getBooks = () => {
            $http({
                url: $scope.api_url + '/books',
            }).then(response => {
                $scope.books = response.data;
            }, err => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        }
        $scope.getBooks();
    })
    .controller('BooksAddController', ($scope, $http, common) => {
        $scope.book = {};

    })
    .controller('UsersAddController', ($scope, $http, common, $location) => {
        (() => {
            $http({
                url: $scope.api_url + '/roles'
            }).then(response => {
                $scope.roles = response.data;
            }, err => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        })();

        $scope.user = {};

        angular.element('#file-upload').on('change', (e) => {
            let fdata = new FormData();
            fdata.append('file', e.target.files[0]);
            $http({
                url: $scope.api_url + '/upload/user',
                data: fdata,
                method: 'POST',
                headers: {
                    'Content-Type': undefined
                }
            }).then(response => {
                $scope.user.photo = response.data;
            }).catch(err => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        });

        $scope.generatePass = () => {
            $scope.user.password = Math.random().toString(36).slice(-8);
        }



        $scope.submit = () => {
            $http({
                url: $scope.api_url + '/users',
                method: 'POST',
                data: $scope.user
            }).then(response => {
                common.goPage('#/users');
            }, (err) => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        }


    })

    .controller('WritersController', ($scope, $http, $mdToast, $log, $rootScope, common, $mdDialog) => {
        $scope.pagination = { current: 1, total: 0, maxpage: 0 }
        $scope.fillPages = () => {
            console.log($scope.pagination);
            $scope.pages = [];
            for (let i = 0; i < $scope.pagination.maxpage; i++) {
                $scope.pages.push({ id: i + 1, selected: i == $scope.pagination.current })
            }
        }



        $scope.delete = (user) => {
            $http({
                url: $scope.api_url + '/writers/' + writer._id,
                method: 'DELETE'
            }).then(response => {
                common.showMessage('Istifadeci silindi');
                $scope.getWriters();
            }, (err) => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        };



        // $scope.showDetailModal=(ev,user)=>{
        //    common.setUser(user);
        //     $mdDialog.show({
        //         controller: UserDetCtrl,
        //         templateUrl: './users/user_detailed.html',
        //         parent: angular.element(document.body),
        //         targetEvent: ev,
        //         clickOutsideToClose:true,
        //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        //     })
        //     .then(function(answer) {
        //           $scope.status = 'You said the information was "' + answer + '".';
        //         }, function() {
        //           $scope.status = 'You cancelled the dialog.';
        //         });
        // }

        // function WriterDetCtrl($scope,$mdDialog,common) {
        //     $scope.writer=common.getWriters();
        //     $scope.hide = function() {
        //         $mdDialog.hide();
        //       };

        //       $scope.cancel = function() {
        //         $mdDialog.cancel();
        //       };

        //       $scope.answer = function(answer) {
        //         $mdDialog.hide(answer);
        //       };
        // }

        $scope.changePage = (page) => {
            console.log(page);
            $scope.pagination.current = page;
            $scope.getWriters(page);
        }


        common.getWriters();

        // $scope.showWriter=(index)=>{
        //     $scope.selectedUser=$scope.users[index];
        //     localStorage.setItem('selectedUser',JSON.stringify($scope.selectedUser));
        //     common.goPage('#/users/'+$scope.selectedUser.id);
        // }
    })
    .controller('WritersAddController', ($scope, $http, common, $location) => {
        common.getCategories();
        $scope.writer = { categoryIds: [] };

        angular.element('#file-upload').on('change', (e) => {
            let fdata = new FormData();
            fdata.append('file', e.target.files[0]);
            $http({
                url: $scope.api_url + '/upload/writer',
                data: fdata,
                method: 'POST',
                headers: {
                    'Content-Type': undefined
                }
            }).then(response => {
                $scope.writer.photo = response.data;
            }).catch(err => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        });

        $scope.submit = () => {
            $http({
                url: $scope.api_url + '/writers',
                method: 'POST',
                data: $scope.writer
            }).then(response => {
                common.goPage('#/writers');
            }, (err) => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        }
    })
    .controller('CategoryAddController', ($scope, $http, common) => {
        $scope.category = {};

        $scope.add = () => {
            $http({
                url: $scope.api_url + '/categories',
                method: "POST",
                data: $scope.category
            }).then(response => {
                common.goPage('#/categories');
            }, err => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        }
    })
    .controller('CategoriesController', ($scope, $http, common) => {

        common.getCategories();


        $scope.delete = (category) => {
            $http({
                url: $scope.api_url + '/categories/' + category._id,
                method: 'delete'
            }).then(response => {
                common.showMessage('Kateroqiya silindi');
                $scope.getCategories();
            }, err => {
                common.showMessage('Xəta baş verdi');
                console.log(err);
            })
        }
    })