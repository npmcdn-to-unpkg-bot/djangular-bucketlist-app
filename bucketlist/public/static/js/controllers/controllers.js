'use strict';
angular.module('bucketlist.controllers', ['ngMaterial'])
.controller('AuthController', ['$rootScope', '$scope', '$state', '$localStorage', '$mdToast', 'BucketListService',
    function AuthController($rootScope, $scope, $state, $localStorage, $mdToast, BucketListService) {

        var showToast = function (message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position($scope.getToastPosition())
                    .hideDelay(2000)
                );
        }
        $scope.login = function(){
            var data = {username: $scope.user.username, password: $scope.user.password};
            BucketListService.auth.login(data).$promise.then(function(response){
                $localStorage.token = response.token;
                $localStorage.authenticated = true;
                $localStorage.currentUser = $scope.user.username;
                $localStorage.currentUserid = response.id;

                $state.go('dashboard');
                showToast('Welcome ' + $scope.user.username);
            })
            .catch(function(responseError){
                showToast('Incorrect credentials! Please try again.')
            });

        };

        $scope.register = function () {
            var data = {username: $scope.user.username, password: $scope.user.password};
            BucketListService.users.create(data).$promise.then($scope.login)
            .catch(function(responseError){
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Yikes! Could not register user.')
                        .position($scope.getToastPosition())
                        .hideDelay(2000)
                );
            });
        };
        var last = {
            bottom: false, top: true,
            left: false, right: true
        };
        var sanitizePosition = function () {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }
        $scope.toastPosition = angular.extend({},last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
              .filter(function(pos) { return $scope.toastPosition[pos]; })
              .join(' ');
        };
    }])

.controller('BucketListController', ['$rootScope', '$scope', '$state', '$localStorage', '$stateParams', '$mdToast', 'BucketListService',
    function BucketListController($rootScope, $scope, $state, $localStorage, $stateParams, $mdToast, BucketListService) {

    $scope.selectedBucket = {};
    $scope.bucketlists = BucketListService.Bucketlists.getAllBuckets();
    $scope.$on('updateBucketList', function() {
        $scope.bucketlists = BucketListService.Bucketlists.getAllBuckets();
    });

    $scope.selectBucketlist = function (bucketlist) {
        $scope.selectedBucket = bucketlist
    };

    // create a bucketlist using the provided name
    $scope.createBucketlist = function () {
        var data = { name: $scope.newbucket.name };
        BucketListService.Bucketlists.createBucket(data).$promise.then(
            function(response) {
                // emit the trigger to a fresh UI update
                $scope.$emit('updateBucketList');
                showToast('Yeiy! Bucketlist created successfully!')
                // nullify the new bucketlist object
                $scope.newbucket.name = null;
            })
    }

    $scope.updateBucket = function () {
        var data = { name: $scope.editbucket.name, id: _id}
        BucketListService.Bucketlists.updateBucket(data).$promise
        .then(function (response) {

        })
    };

     $scope.deleteBucket = function (bucketlist) {
        bucketlist.$deleteBucket().then(function() {
            $scope.$emit('updateBucketList');
            showToast('Bucketlist deleted successfully');
        });
     };

    // helper functions for toast.
    var showToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position($scope.getToastPosition())
                .hideDelay(2000)
            );
    };
    var last = {
        bottom: false, top: true,
        left: false, right: true
    };
    var sanitizePosition = function () {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    $scope.toastPosition = angular.extend({},last);
    $scope.getToastPosition = function () {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
          .filter(function(pos) { return $scope.toastPosition[pos]; })
          .join(' ');
    };
}]);
