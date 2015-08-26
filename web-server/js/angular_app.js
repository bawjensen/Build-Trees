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

buildTrees.controller('ChampDataCtrl', function($scope, $location, ChampDataEntry) {
  ChampDataEntry('After').then(function(result) {
      $('#after-container .loading-spinner').hide();
      plot(result.data, result.item, result.champ, '#after-container', false);
    });

  ChampDataEntry('Before').then(function(result) {
      $('#before-container .loading-spinner').hide();
      plot(result.data, result.item, result.champ, '#before-container', true);
    })
    .catch(function(err) { $location.path('/404') });
});

buildTrees.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/index.html'
      })
      .when('/404', {
        templateUrl: 'views/invalidChamp.html'
      })
      .when('/:champName', {
        templateUrl: 'views/champ.html',
        controller: 'ChampDataCtrl'
      });
  }]);
