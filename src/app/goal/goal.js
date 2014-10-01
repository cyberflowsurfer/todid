/**
 * Goals module
 */

function categoryList(goals) {
  result = ['All', 'personal', 'work'];
  /*
  for (var i = 0; i < goals.length; i++) {
    result.push(goals[goal].category);
  }
  debugger;
  */
  return result;
}

angular.module('todid.goal', [
  'ui.router',
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
  $scope.alert        = function(text) {
	alert(text);
  };
  $scope.goals        = GoalRes.query(function(){
    $scope.categories = categoryList($scope.goals);
  });
  $scope.showCategory = 'All';

  $scope.editGoal = function(goal) {
    $state.transitionTo('goal', { goalId: goal.id });
  };
  $scope.deleteGoal = function(goal) {
    goal.$remove();
    $scope.goals = GoalRes.query();
    $state.transitionTo('goals');
  };
  $scope.newGoal = function() {
    $state.transitionTo('goal');
  };
  $scope.filterCategory = function(goal) {
    return ($scope.showCategory == goal.category || $scope.showCategory === 'All');
  };
  $scope.setShowCategory = function(category) {
    $scope.showCategory = category;
  };
})

.controller('GoalCtrl', function GoalController( $scope, GoalRes, $state, $stateParams ) {
  $scope.goalId = parseInt($stateParams.goalId, 10);
  $scope.goal   = $scope.goalId ? GoalRes.get({id: $scope.goalId}) : new GoalRes();

  $scope.submit = function() {
    if ($scope.goalId) {
      $scope.goal.$update(function(response) {
        $state.transitionTo('goals');
      }, function(error) {
        $scope.error = error.data;
      });
    }
    else {
      $scope.goal.$save(function(response) {
        $state.transitionTo('goals');
      }, function(error) {
        $scope.error = error.data;
      });
    }
  };

  $scope.cancel = function() {
    $state.transitionTo('goals');
  };
})

.factory( 'GoalRes', function ( $resource )  {
  return $resource("../goals/:id.json", {id:'@id'}, {'update': {method:'PUT'}, 'remove': {method: 'DELETE', headers: {'Content-Type': 'application/json'}}});
})
;
