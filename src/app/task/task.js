/**
 * AngularJS Module: todidtask
 * Date:             Mon Sep 01 15:46:15 2014
 */
angular.module('todid.task', [
  'ui.router',
  'ngResource',
  'ngGrid'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'tasks', {
    url: '/tasks',
    views: {
      "main": {
        controller: 'TasksCtrl',
        templateUrl: 'task/tasks.tpl.html'
      }
    },
    data:{ pageTitle: 'Tasks' }
  })
  .state( 'task', {
    url: '/task?taskId',
    views: {
      "main": {
        controller: 'TaskCtrl',
        templateUrl: 'task/task.tpl.html'
      }
    },
    data:{ pageTitle: 'Task'
    }
  })
  ;
})

/**
 * Controller for listing tasks
 */
.controller( 'TasksCtrl', function TasksController( $scope,TaskRes, $state) {
  $scope.tasks = TaskRes.query();
  $scope.gridOptions = {
    data: 'tasks',
    columnDefs: [
      {field: 'goal_id', displayName: 'Goal'},
      {field: 'activity', displayName: 'Activity'},
      {field: 'who', displayName: 'Who'},
      {field: 'name', displayName: 'Task'},
      {field: 'minutes', displayName: 'Minutes'},
      {displayName: 'Edit', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="editTask(row.entity)" >Edit</button> '},
      {displayName: 'Delete', cellTemplate: '<button id="deleteBtn" type="button" class="btn-small" ng-click="deleteTask(row.entity)" >Delete</button> '}
    ],
    multiSelect: false
  };
  $scope.editTask = function(task) {
    $state.transitionTo('task', { taskId: task.id });
  };
  $scope.deleteTask = function(task) {
    task.$remove();
    $scope.Task = TaskRes.query();
    $state.transitionTo('tasks');
  };
  $scope.newTask = function() {
    $state.transitionTo('task');
  };
})

.controller('TaskCtrl', function GoalController( $scope, TaskRes, $state, $stateParams ) {
  $scope.taskId = parseInt($stateParams.taskId, 10);
  $scope.task   = $scope.taskId ? TaskRes.get({id: $scope.taskId}) : new TaskRes();

  $scope.submit = function() {
    if ($scope.taskId) {
      $scope.task.$update(function(response) {
        $state.transitionTo('tasks');
      }, function(error) {
        $scope.error = error.data;
      });
    }
    else {
      $scope.task.$save(function(response) {
        $state.transitionTo('tasks');
      }, function(error) {
        $scope.error = error.data;
      });
    }
  };

  $scope.cancel = function() {
    $state.transitionTo('tasks');
  };
})

.factory( 'TaskRes', function ( $resource )  {
  return $resource("../tasks/:id.json", {id:'@id'}, {'update': {method:'PUT'}, 'remove': {method: 'DELETE', headers: {'Content-Type': 'application/json'}}});
})
;
