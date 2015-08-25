'use strict';

/* App Module */

var buildTrees = angular.module('buildTrees', [
  'ngRoute',
  'ngResource'
]);

buildTrees.factory('ChampDataEntry', function($resource, $q, $routeParams) {
  return function(mode) {
    return $q.all({
      data: $resource('data/' + $routeParams.champName + mode + '.json', {}, {}).get().$promise,
      item: $resource('data/item' + mode + '.json', {}, {}).get().$promise,
      champ: $resource('data/champ' + mode + '.json', {}, {}).get().$promise
    });
  };
});

buildTrees.controller('MainCtrl', function($scope, $location, $window) {
  $scope.$on('$viewContentLoaded', function(event) {
    $window.ga('send', 'pageview', { page: $location.url() });
  });
});

buildTrees.controller('ChampDataCtrl', function($scope, ChampDataEntry) {
  ChampDataEntry('After').then(function(result) {
      $('#after-container .loading-spinner').hide();
      plot(result.data, result.item, result.champ, '#after-container', false);
    });

  ChampDataEntry('Before').then(function(result) {
      $('#before-container .loading-spinner').hide();
      plot(result.data, result.item, result.champ, '#before-container', true);
    });
});

buildTrees.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'web-server/views/index.html'
      }).
      when('/:champName', {
        templateUrl: 'web-server/views/champ.html',
        controller: 'ChampDataCtrl'
      }).
      otherwise({
        redirectTo: '/404.html'
      });
  }]);
