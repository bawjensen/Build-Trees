'use strict';

/*
Angular app script, to handle basic routing for the site as well as resource loading.
*/

var buildTrees = angular.module('buildTrees', [
  'ngRoute',
  'ngResource'
]);

// Resource service for loading champion data for d3
buildTrees.factory('ChampDataEntry', function($resource, $q, $routeParams) {
  return function(mode) {
    return $q.all({
      data: $resource('data/' + $routeParams.champName + mode + '.json', {}, {}).get().$promise,
      item: $resource('data/item' + mode + '.json', {}, {}).get().$promise,
      champ: $resource('data/champ' + mode + '.json', {}, {}).get().$promise
    });
  };
});

// Site-wide controller
buildTrees.controller('MainCtrl', function($scope, $location, $window) {
  $scope.$on('$viewContentLoaded', function(event) {
    $window.ga('send', 'pageview', { page: $location.url() });
  });
});

// Champ page controller
buildTrees.controller('ChampDataCtrl', function($scope, $location, ChampDataEntry) {
  ChampDataEntry('After').then(function(result) {
      $('#after-container .loading-spinner').hide();
      plot(result.data, result.item, result.champ, '#after-container', false);
    })
    .catch(function(err) { $location.path('/404') });

  ChampDataEntry('Before').then(function(result) {
      $('#before-container .loading-spinner').hide();
      plot(result.data, result.item, result.champ, '#before-container', true);
    })
    .catch(function(err) { $location.path('/404') });
});

// Routing for the site
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
