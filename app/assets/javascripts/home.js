(function () {

  var app = angular.module('MyWishList', ['ngResource']);

  app.config(["$httpProvider", function (provider) {
    provider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
  }]);

  app.factory('Items', ['$resource', function($resource) {
    return $resource('/items.json', {},{
      query: { method: 'GET', isArray: true },
      create: { method: 'POST' }
    })
  }]);

  app.factory('Item', ['$resource', function ($resource) {
    return $resource('/items/:id.json', {}, {
      show: { method: 'GET' },
      update: { method: 'PUT', params: {id: '@id'} },
      delete: { method: 'DELETE', params: {id: '@id'} }
    });
  }]);

  app.controller('HomeController', ['$scope', '$resource', 'Items', function ($scope, $resource, Items) {
    this.list = Items.query();
    this.view = 'list';

    this.addItem = function (item) {
      var self = this;

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

})();