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

  app.factory('ArchivedItems', ['$resource', function ($resource) {
    return $resource('/home/users/archive/:id.json', {}, {
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

  app.factory('Images', ['$resource', function ($resource) {
    return $resource('/image_url.json', {}, {
      query: { method: 'POST', params: {url: '@url'} }
    })
  }]);

  app.controller('HomeController', ['$scope', '$resource', 'Items', 'Item', 'ItemsById', 'ArchivedItems', 'Images',
    function ($scope, $resource, Items, Item, ItemsById, ArchivedItems, Images) {
      $scope.yourList = true;
      $scope.showArchive = false;
      this.view = 'list';

      $scope.toggleArchive = function() {
        if($scope.showArchive) {
          $scope.showArchive = false;
        } else {
          $scope.showArchive = true;
        }
      };

      $scope.loadList = function (user) {
        $scope.currentUser = user;
        $scope.list = ItemsById.query(user, function (items) {
          // for(var i = 0; i < items.length; i++) {
          //   Images.query({url: items[i].link}, function (image_url) {
          //     items[i]['image_url'] = image_url;
          //   });
          // }
        });
        $scope.archive = ArchivedItems.query(user);
      };

      this.updateItem = function (item, userId) {
        var self = this;

        if ($scope.addItemForm.$valid) {
          if(item.id === undefined) {
            item.user_id = userId;
            item.status = 'Available';

            Items.create({item: item}, function () {
              $('#details').modal('hide');
              $scope.loadList($scope.currentUser);
            }, function (error) {
              console.log(error);
            });
          } else {
            Item.update(item, function() {
              $('#details').modal('hide');
              $scope.loadList($scope.currentUser);
            }, function (error) {
              console.log(error);
            });
          }
        }
      };

      $scope.editItem = function(itemToEdit) {
        $scope.item = itemToEdit;
        $scope.item.mode = 'edit';

        $('#details').modal('show');
      };

      $scope.unArchive = function(item) {
        var self = this;
        item.archived = false;

        Item.update(item, function() {
          $scope.loadList($scope.currentUser);
        }, function (error) {
          console.log(error);
        });
      }

      $scope.setMode = function(mode) {
        $scope.item = {
          title: '',
          description: '',
          link: '',
          importance: '',
          mode: 'new'
        };
        $('#details').modal('show');
      };

      this.isView = function (view) {
        return this.view === view;
      };

      $scope.deleteItem = function (itemId) {
        var self = this;

        if (confirm("Are you sure you want to delete this item?")) {
          Item.delete({ id: itemId }, function () {
            $scope.loadList($scope.currentUser);
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
        $scope.currentUser = user;
        $scope.selectedUser = user;
        $scope.list = ItemsById.query(user);
        this.view = 'userList';
      };

      this.nameSelected = function (user) {
        var u = $scope.selectedUser;
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

      $scope.markPurchased = function (item, userToPurchaseId) {
        item.status = 'Unavailable';
        item.user_to_purchase = userToPurchaseId;

        Item.update(item, function () {
          $scope.list = ItemsById.query($scope.currentUser);
        });
      };

      $scope.markPending = function (item, userToPurchaseId) {
        item.status = 'Pending';
        item.user_to_purchase = userToPurchaseId;

        Item.update(item, function () {
          $scope.list = ItemsById.query($scope.currentUser);
        });
      };
    }]);

  app.controller('PurchasesController', ['$scope', 'Purchases', 'Item', function ($scope, Purchases, Item) {
    $scope.purchases = true;

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

  app.directive("wishList", function () {
      return {
        restrict: 'E',
        templateUrl: "/wish_list"};
    }
  );
})();