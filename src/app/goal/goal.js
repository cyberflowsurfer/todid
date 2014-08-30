/**
 * Goals module
 */
angular.module('todid.goal', [
  'ui.state',
  'ngResource',
  'ngGrid'
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
  })
  .state( 'goal', {
    url: '/goal?goalId',
    views: {
      "main": {
        controller: 'GoalCtrl',
        templateUrl: 'goal/goal.tpl.html'
      }
    },
    data:{ pageTitle: 'Goal'
    }
  })
  ;
})

/**
 * Controller for listing Goals
 */
.controller( 'GoalsCtrl', function GoalsController( $scope, GoalRes, $state) {
  $scope.goals = GoalRes.query();
  $scope.gridOptions = {
    data: 'goals',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Goal'},
      {field: 'category', displayName: 'Category'},
      {field: 'description', displayName: 'Description'},
      {displayName: 'Edit', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="editGoal(row.entity)" >Edit</button> '}
    ],
    multiSelect: false
  };
  $scope.editGoal = function(goal) {
    $state.transitionTo('goal', { goalId: goal.id });
  };
  $scope.newGoal = function() {
    $state.transitionTo('goal');
  };
})

.controller('GoalCtrl', function GoalController( $scope, GoalRes, $state, $stateParams ) {
  $scope.goalId = parseInt($stateParams.goalId, 10);

  if ($scope.goalId) {
    $scope.goal = GoalRes.get({id: $scope.goalId});
  } else {
    $scope.goal = new GoalRes();
  }

  $scope.submit = function() {
    if ($scope.goalId) {
      $scope.goal.$update(function(response) {
        $state.transitionTo('goals');
      });
    }
    else {
      $scope.goal.$save(function(response) {
        $state.transitionTo('goals');
      });
    }
  };

  $scope.cancel = function() {
    $state.transitionTo('goals');
  };
})

.factory('GoalRes', function ( $resource ) {
  return $resource('../goals/:id.json', {id: '@id'}, {'update': {method:'PUT'}});
})
;
