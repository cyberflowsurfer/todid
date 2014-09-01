/**
 * Unit Test for: todid.goal
 * Date:          Fri Aug 29 21:00:10 2014
 * Adapted from:  https://github.com/PaulL1/league-tutorial-rails4/blob/tutorial_7/src/app/club/club.spec.js
 */

var unitTest = {};
unitTest.resources = [
        {"id":0,"name":"Goal 0","category":"personal","description": "I want an initial goal","created_at":"2014-08-28T00:00:00.000Z","updated_at":"2014-08-28T00:00:00.000Z"},
        {"id":1,"name":"Goal 1","category":"personal","description":"I want to leverage JavaScript client technologies with Rails","created_at":"2014-08-28T00:00:00.000Z","updated_at":"2014-08-28T00:00:00.000Z"},
        {"id":2,"name":"Goal 2","category":"work","description":"I want to learn about the Nutanix hyperconverged appliance","created_at":"2014-08-28T00:00:00.000Z","updated_at":"2014-08-28T00:00:00.000Z"}
];
unitTest.application = 'todid';
unitTest.resource    = 'goal';
unitTest.url_base    = '../' + unitTest.resource + 's';
unitTest.url_index   = unitTest.url_base + '.json';
unitTest.detailCtrl  = 'GoalCtrl';
unitTest.indexCtrl  = 'GoalsCtrl';


describe( 'Goal functionality', function() {
  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module(unitTest.application));

  // create the custom mocks on the root scope
  beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_, $state){
    //create an empty scope
    scope = $rootScope.$new();

    // we're just declaring the httpBackend here, we're not setting up expectations or when's - they change on each test
    scope.httpBackend = _$httpBackend_;
    scope.$state      = $state;
  }));

  afterEach(function() {
    scope.httpBackend.verifyNoOutstandingExpectation();
    scope.httpBackend.verifyNoOutstandingRequest();
  });

  describe( 'Resource list controller', function() {

    beforeEach(angular.mock.inject(function($controller){
      //declare the controller and inject our scope
      $controller(unitTest.indexCtrl, {$scope: scope, $state: scope.$state});

      // setup a mock for the resource - instead of calling the server always return a pre-canned response
      scope.httpBackend.expect('GET', unitTest.url_index).respond(unitTest.resources);
      scope.$digest();
      scope.httpBackend.flush();
    }));

    describe( 'Initial render', function() {
      it('Has expected number of resources defined', function(){
        expect(scope.goals.length).toEqual(unitTest.resources.length);
      });

      it('Resource fields match expected', function(){
        expect(scope.goals[0].category).toEqual(unitTest.resources[0].category);
      });
    });

    describe('Other controller methods', function(){
      it('calls edit on a resource', function() {
        // we expect it to call $state
        spyOn(scope.$state, "transitionTo").andCallThrough();

        // call edit
        scope.editGoal(scope.goals[1]);

        // we expect the goal state to be called, passing in the id of the first item
        expect(scope.$state.transitionTo).toHaveBeenCalledWith(unitTest.resource, { goalId: 1});
      });

      it('Calls delete resource; success', function() {
        var rsrcId = 0;
        response = new Array(unitTest.resources.length - 1);
        for (var i = 0; i < unitTest.resources.length; i++) {
          if (unitTest.resources[i].id != i) {
            response.push(unitTest.resources[i]);
          }
        }
        scope.httpBackend.expect('DELETE', unitTest.url_base + '/' + rsrcId + '.json').respond();
        scope.httpBackend.expect('GET', unitTest.url_index).respond(response);

        scope.deleteGoal(scope.goals[rsrcId]);

        scope.$digest();
        scope.httpBackend.flush();
      });

      it('Calls new', function() {
        // we expect it to call $state
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.newGoal();

        // we expect the goal state to be called, passing in the id of the first item
        expect(scope.$state.transitionTo).toHaveBeenCalledWith(unitTest.resource);
      });
    });
  });

  describe( 'Resource detail controller', function() {
    //mock the controller
    beforeEach(function() {
      // mock the stateParams
      scope.fakeStateParams = {
        goalId: "2"
      };
    });

    describe( 'Resource detail controller base tests:', function() {
      it('Initial detail controller render receives a goal id, gets goal, success', angular.mock.inject(function($controller){
        var rsrcId = parseInt(scope.fakeStateParams.goalId, 10);
        $controller(unitTest.detailCtrl, { $scope: scope, $stateParams: scope.fakeStateParams });
        expect(scope.goalId).toEqual(rsrcId);

        scope.httpBackend.expectGET(unitTest.url_base + '/' + rsrcId + '.json').respond(unitTest.resources[2]);

        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.goal.name).toEqual(unitTest.resources[rsrcId].name);
      }));

      it('Initial detail controller render does not receive a goal id, creates new goal, success', angular.mock.inject(function( $controller) {
        // set goalId to null
        scope.fakeStateParams.goalId = null;

        $controller(unitTest.detailCtrl, { $scope: scope, $stateParams: scope.fakeStateParams });
        expect(scope.goalId).toBeNaN();
      }));
    });

    describe( 'Resource detail controller update method tests', function() {
      var rsrcId = 2;

      beforeEach(angular.mock.inject(function($controller){
        $controller(unitTest.detailCtrl, {$scope: scope, $stateParams: scope.fakeStateParams});

        // The initial render triggers a get, drain that before we start the test proper
        scope.httpBackend.expectGET(unitTest.url_base +'/' + rsrcId + '.json').respond(unitTest.resources[rsrcId]);
        scope.$digest();
        scope.httpBackend.flush();
       }));

      it('Submit with goalId calls put on server, put succeeds', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.goal.name = 'Changed name';
        scope.submit();

        scope.httpBackend.expectPUT(unitTest.url_base + '/' + rsrcId + '.json').respond({});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('goals');
      });

      it('put resource with illegal field value, put fails', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.goal.name = '';
        scope.submit();

        scope.httpBackend.expectPUT(unitTest.url_base + '/' + rsrcId + '.json').respond(422, {"name":["can't be blank"]});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).not.toHaveBeenCalledWith(unitTest.resource + 's');
        expect(scope.error).toEqual( { name: [ "can't be blank" ] });
      });
    });

    describe( 'Resource detail controller save method tests', function() {
      beforeEach(angular.mock.inject(function($controller){
        scope.fakeStateParams.goalId = null;
        $controller(unitTest.detailCtrl, {$scope: scope, $stateParams: scope.fakeStateParams});
       }));

      it('Submit with goalId calls post on server, post succeeds', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.goal.name = 'Changed name';
        scope.submit();

        scope.httpBackend.expectPOST(unitTest.url_index).respond({});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('goals');
      });

      it('post resource with illegal field value, post fails', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.goal.name = '';
        scope.submit();

        scope.httpBackend.expectPOST(unitTest.url_index).respond(422, {"name":["can't be blank"]});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).not.toHaveBeenCalledWith(unitTest.resource + 's');
        expect(scope.error).toEqual( { name: [ "can't be blank" ] });
      });
    });
  });
});
