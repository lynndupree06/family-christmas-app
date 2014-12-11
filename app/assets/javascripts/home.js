(function () {

  var app = angular.module('MyWishList', ['ngResource']);

  app.config(["$httpProvider", function (provider) {
    provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
  }]);

  app.factory('Items', ['$resource', function ($resource) {
    return $resource('/items.json', {}, {
      query: { method: 'GET', isArray: true },
      create: { method: 'POST' }
    })
  }]);

  app.factory('ItemsById', ['$resource', function ($resource) {
    return $resource('/home/users/items/:id.json', {}, {
      query: { method: 'GET', isArray: true }
    })
  }]);

  app.factory('Item', ['$resource', function ($resource) {
    return $resource('/items/:id.json', {}, {
      show: { method: 'GET' },
      update: { method: 'PUT', params: {id: '@id'} },
      delete: { method: 'DELETE', params: {id: '@id'} }
    });
  }]);

  app.factory('Users', ['$resource', function ($resource) {
    return $resource('/home/users.json', {}, {
      query: { method: 'GET', isArray: true },
      create: { method: 'POST' }
    })
  }]);

  app.factory('OtherUsers', ['$resource', function ($resource) {
    return $resource('/home/users/others/:id.json', {}, {
      query: { method: 'GET', isArray: true }
    })
  }]);

  app.controller('HomeController', ['$scope', '$resource', 'Items', 'Item', 'ItemsById',
    function ($scope, $resource, Items, Item, ItemsById) {

      this.view = 'list';

      this.loadList = function (user) {
        $scope.list = ItemsById.query(user);
      };

      this.addItem = function (item, userId) {
        var self = this;
        item.user_id = userId;
        item.status = 'Available';

        if ($scope.addItemForm.$valid) {
          Items.create({item: item}, function () {
            self.list = Items.query();
            self.view = 'list';
          }, function (error) {
            console.log(error)
          });
        }
      };

      this.isView = function (view) {
        return this.view === view;
      };

      this.setView = function (newView) {
        this.view = newView;
      };

      $scope.deleteItem = function (itemId) {
        if (confirm("Are you sure you want to delete this item?")) {
          Item.delete({ id: itemId }, function () {
            $scope.list = Items.query();
          });
        }
      };
    }]);

  app.controller('OtherListController', ['$scope', 'OtherUsers', 'Item', 'Items', 'ItemsById',
    function ($scope, OtherUsers, Item, Items, ItemsById) {

      this.view = 'list';

      this.loadUsers = function (userId) {
        this.users = OtherUsers.query({id: userId});
      };

      this.viewList = function (user) {
        $scope.user = user;
        $scope.list = ItemsById.query(user);
        this.view = 'userList';
      };

      this.isView = function (view) {
        return this.view === view;
      };

      this.setView = function (newView) {
        this.view = newView;
      };

      this.isUnavailable = function (status) {
        return status !== 'Available';
      };

      this.isAvailable = function (status) {
        return status === 'Available' || status === null;
      };

      this.isPending = function (status) {
        return status === 'Pending';
      };

      this.markPending = function (item) {
        item.status = 'Pending';

        Item.update(item, function () {
          $scope.list = ItemsById.query($scope.user);
        });
      };

      this.getRating = function (num) {
        var arr = [];
        for(var i = 1; i <= 5; i++) {
          if(i <= num) {
            arr.push(1);
          } else {
            arr.push(0);
          }
        }
        return arr;
      }
    }]);

  app.directive("wishList", function () {
      return {
        restrict: 'E',
        templateUrl: "/wish_list"};
    }
  );
})();