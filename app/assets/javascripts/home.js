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

  app.factory('Purchases', ['$resource', function ($resource) {
    return $resource('/home/users/purchases/:id.json', {}, {
      query: { method: 'GET', isArray: true }
    })
  }]);

  app.controller('HomeController', ['$scope', '$resource', 'Items', 'Item', 'ItemsById',
    function ($scope, $resource, Items, Item, ItemsById) {

      this.view = 'list';

      this.loadList = function (user) {
        $scope.currentUser = user;
        $scope.list = ItemsById.query(user);
      };

      this.addItem = function (item, userId) {
        var self = this;
        item.user_id = userId;
        item.status = 'Available';

        if ($scope.addItemForm.$valid) {
          Items.create({item: item}, function () {
            self.loadList($scope.currentUser);;
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
        var self = this;

        if (confirm("Are you sure you want to delete this item?")) {
          Item.delete({ id: itemId }, function () {
            self.loadList($scope.currentUser);
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

      $scope.isUnavailable = function (status) {
        return status !== 'Available';
      };

      $scope.isAvailable = function (status) {
        return status === 'Available' || status === null;
      };

      $scope.isPending = function (status) {
        return status === 'Pending';
      };

      $scope.markPurchased = function (item) {
        item.status = 'Unavailable';

        Item.update(item, function () {
          $scope.list = ItemsById.query($scope.user);
        });
      };

      this.markPending = function (item, userToPurchaseId) {
        item.status = 'Pending';
        item.user_to_purchase = userToPurchaseId;

        Item.update(item, function () {
          $scope.list = ItemsById.query($scope.user);
        });
      };
    }]);

  app.controller('PurchasesController', ['$scope', 'Purchases', 'Item', function ($scope, Purchases, Item) {
    this.loadPurchases = function (userId) {
      $scope.currentUserId = userId;
      $scope.list = Purchases.query({id: userId});
    };

    $scope.isUnavailable = function (status) {
      return status !== 'Available';
    };

    $scope.isAvailable = function (status) {
      return status === 'Available' || status === null;
    };

    $scope.isPending = function (status) {
      return status === 'Pending';
    };

    $scope.markPurchased = function (item) {
      item.status = 'Unavailable';

      Item.update(item, function () {
        $scope.list = Purchases.query({id: $scope.currentUserId});
      });
    };
  }]);

//  app.directive("wishList", function () {
//      return {
//        restrict: 'E',
//        templateUrl: "/wish_list"};
//    }
//  );
})();