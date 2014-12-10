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

  app.controller('HomeController', ['$scope', '$resource', 'Items', function ($scope, $resource, Items) {
    this.list = Items.query();
    this.view = 'list';

    this.addItem = function (item, userId) {
      var self = this;
      item.user_id = userId;

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
    }
  }]);

  app.controller('OtherListController', ['$scope', 'Users', 'Items', 'ItemsById', function ($scope, Users, Items, ItemsById) {
    this.users = Users.query();
    this.view = 'list';

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
  }]);

//  app.directive("wishList", function () {
//      return {
//        restrict: 'E',
//        templateUrl: "<%= asset_path('templates/wish_list.html') %>"};
//    }
//  );
})();