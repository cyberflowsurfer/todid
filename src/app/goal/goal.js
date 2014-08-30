/**
 * Goals module
 */
angular.module('todid.goal', [
  'ui.state',
  'ngResource'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'goals', {
    url: '/goals',
    views: {
      "main": {
        controller: 'GoalsCtrl',
        templateUrl: 'goal/goals.tpl.html'
      }
    },
    data:{ pageTitle: 'Goals' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'GoalsCtrl', function GoalsController( $scope, GoalRes ) {
  $scope.goals = GoalRes.query();
})

.factory('GoalRes', function ( $resource ) {
  return $resource('../goals.json');
})
;


